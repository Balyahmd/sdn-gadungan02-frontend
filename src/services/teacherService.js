import api from "../utils/api";

const TeacherService = {
  getTeachers: async (searchTerm = "") => {
    const response = await api.get(
      `/teachers?search=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  },

  createTeacher: async (formData) => {
    const response = await api.post("/teachers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateTeacher: async (id, formData) => {
    const response = await api.put(`/teachers/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteTeacher: async (id) => {
    return await api.delete(`/teachers/${id}`);
  },
};

export default TeacherService;
