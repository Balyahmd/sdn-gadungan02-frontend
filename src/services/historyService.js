import api from "../utils/api";

const HistoryService = {
  getHistory: async () => {
    try {
      const response = await api.get("/history");
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil riwayat:", error);
      throw error;
    }
  },
  updateHistory: async (formData) => {
    try {
      const response = await api.put("/history", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Riwayat berhasil diperbarui:", response.data);
      return response.data;
    } catch (error) {
      console.error("Gagal memperbarui riwayat:", error);
      throw error;
    }
  },
};

export default HistoryService;
