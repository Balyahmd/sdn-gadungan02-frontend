/* eslint-disable no-useless-catch */
import api from "../utils/api";

const PostService = {
  getPosts: async (searchTerm = "") => {
    const response = await api.get(
      `/posts?search=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },


  createPost: async (formData) => {
    try {
      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePost: async (id, formData) => {
    try {
      const response = await api.put(`/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default PostService;
