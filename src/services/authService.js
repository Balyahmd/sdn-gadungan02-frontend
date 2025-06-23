import api from "../utils/api";

// Request interceptor for adding token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only remove token and redirect if it's not a verify request
      if (!error.config.url.includes("/auth/verify")) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

const login = async (username, password) => {
  try {
    const response = await api.post("/auth/login", { username, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Set default header for subsequent requests
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
      };
    }
    return {
      success: false,
      message: "Login failed - no token received",
    };
  } catch (error) {
    console.error("Login error details:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
      error: error.response?.data?.error || "LOGIN_FAILED",
    };
  }
};

const verify = async () => {
  try {
    const response = await api.get("/auth/verify");

    if (response.data.success) {
      console.log("Verify successful:", response.data.user);
      return {
        success: true,
        user: response.data.user,
      };
    }

    console.log("Verify failed:", response.data.message);
    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Verify request failed:", error);
    // Don't remove token on verify failure, just return error
    return {
      success: false,
      message: "Authentication service unavailable",
    };
  }
};

const logout = async () => {
  try {
    console.log("Attempting logout");
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    // Always clean up client-side on logout
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    console.log("Client-side auth cleaned up");
  }
};

export { login, verify, logout, api };
