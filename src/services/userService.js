import api from "../utils/api";

const UserService = {
  getUsers: async (search = "") => {
    const response = await api.get(`/users?search=${search}`);
    return response.data;
  },

  createUser: (data) => api.post("/users", data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default UserService;
