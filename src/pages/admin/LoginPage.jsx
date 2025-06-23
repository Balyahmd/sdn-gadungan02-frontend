import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo_sdn_gadungan02.png";
import { toast, ToastContainer } from "react-toastify";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateInputs = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username wajib diisi";
    } else if (formData.username.length < 3) {
      errors.username = "Username minimal 4 karakter";
    }

    if (!formData.password) {
      errors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      errors.password = "Password minimal 6 karakter";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join(", ");
      setError(errorMessages);
      toast.error(errorMessages, {
        icon: <XMarkIcon className="h-5 w-5" />,
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        if (result.user && result.user.role) {
          const targetRoute =
            result.user.role === "superadmin"
              ? "/admin/dashboard"
              : "/admin/kelola-postingan";

          toast.success("Login berhasil! Selamat datang kembali.", {
            icon: <CheckIcon className="h-5 w-5" />,
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

          setTimeout(() => {
            navigate(targetRoute);
          }, 3000);
        } else {
          toast.error("Data pengguna tidak lengkap", {
            icon: <XMarkIcon className="h-5 w-5" />,
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
          setError("Data pengguna tidak lengkap");
        }
      } else {
        toast.error(result.message || "Username atau password salah", {
          icon: <XMarkIcon className="h-5 w-5" />,
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        setError(result.message || "Username atau password salah");
      }
    } catch (err) {
      const errorMsg = "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMsg);
      toast.error(errorMsg, {
        icon: <XMarkIcon className="h-5 w-5" />,
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-400">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-28 w-auto mb-4" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Login Admin</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <ToastContainer />
            <label className="block mb-2">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-2 border rounded"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <div className="relative">
              <label className="block mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full p-2 border rounded pr-10"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-14 transform -translate-y-1/2 text-sm text-gray-600 focus:outline-none">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50">
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
