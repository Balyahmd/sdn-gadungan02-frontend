import { useState, useEffect } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import { toast, ToastContainer } from "react-toastify";
import HistoryService from "../../services/historyService.js";
import VisiMisiService from "../../services/visiMisiService.js";
import StatistikSection from "../../components/admin/section/StatistikSection.jsx";
import HistorySection from "../../components/admin/section/HistorySection.jsx";
import NavigationsTabs from "../../components/admin/NavigationsTabs";
import VisionMissionSection from "../../components/admin/section/VisiMissionSection";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("vision-mission");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data States
  const [historyData, setHistoryData] = useState({
    id: null,
    text_sejarah: "Memuat sejarah sekolah...",
    author: null,
    createdAt: null,
    updatedAt: null,
  });

  const [visiMisiData, setVisiMisiData] = useState({
    id: null,
    visi: "Memuat visi sekolah...",
    misi: ["Memuat misi sekolah..."],
    tujuan: ["Memuat tujuan sekolah..."],
    author: null,
    createdAt: null,
    updatedAt: null,
  });

  // Form State
  const [editForm, setEditForm] = useState({
    vision: "",
    newMission: "",
    missions: [],
    newGoal: "",
    goals: [],
    history: "",
  });

  // Data Fetching
  const loadData = async () => {
    try {
      setIsLoading(true);

      const historyResponse = await HistoryService.getHistory();
      setHistoryData({
        id: historyResponse.data.id,
        text_sejarah: historyResponse.data.text_sejarah,
        user_username: historyResponse.data.user_username,
        author: historyResponse.data.author,
        createdAt: historyResponse.data.created_at,
        updatedAt: historyResponse.data.updated_at,
      });

      const visiMisiResponse = await VisiMisiService.getVisiMisi();
      setVisiMisiData({
        id: visiMisiResponse.data.id,
        visi: visiMisiResponse.data.text_visi || "Visi sekolah belum tersedia",
        misi: Array.isArray(visiMisiResponse.data.text_misi)
          ? visiMisiResponse.data.text_misi
          : [visiMisiResponse.data.text_misi || "Misi sekolah belum tersedia"],
        tujuan: Array.isArray(visiMisiResponse.data.text_tujuan)
          ? visiMisiResponse.data.text_tujuan
          : [
              visiMisiResponse.data.text_tujuan ||
                "Tujuan sekolah belum tersedia",
            ],
        author: visiMisiResponse.data.author,
        createdAt: visiMisiResponse.data.created_at,
        updatedAt: visiMisiResponse.data.updated_at,
      });

      setEditForm({
        vision: visiMisiResponse.data.text_visi || "",
        newMission: "",
        missions: Array.isArray(visiMisiResponse.data.text_misi)
          ? visiMisiResponse.data.text_misi
          : [visiMisiResponse.data.text_misi || ""],
        newGoal: "",
        goals: Array.isArray(visiMisiResponse.data.text_tujuan)
          ? visiMisiResponse.data.text_tujuan
          : [visiMisiResponse.data.text_tujuan || ""],
        history: historyResponse.data.text_history || "",
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Gagal memuat data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Edit Handlers
  const startEditing = (section) => {
    setEditForm({
      vision: visiMisiData.visi,
      newMission: "",
      missions: Array.isArray(visiMisiData.misi)
        ? [...visiMisiData.misi]
        : [visiMisiData.misi],
      newGoal: "",
      goals: Array.isArray(visiMisiData.tujuan)
        ? [...visiMisiData.tujuan]
        : [visiMisiData.tujuan],
      history: historyData.text_sejarah,
    });
    setIsEditing(section);
  };

  // Save Handlers
  const saveVisionMission = async () => {
    try {
      const response = await VisiMisiService.updateVisiMisi({
        text_visi: editForm.vision,
        text_misi: editForm.missions,
        text_tujuan: editForm.goals,
      });

      setVisiMisiData({
        id: response.data.id,
        visi: response.data.text_visi,
        misi: Array.isArray(response.data.text_misi)
          ? response.data.text_misi
          : [response.data.text_misi],
        tujuan: Array.isArray(response.data.text_tujuan)
          ? response.data.text_tujuan
          : [response.data.text_tujuan],
        author: response.data.author,
        user_username: response.data.user_username,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at,
      });

      setIsEditing(false);
      toast.success("Visi, Misi & Tujuan berhasil diperbarui");
    } catch (error) {
      console.error("Gagal memperbarui visi misi:", error);
      toast.error("Gagal memperbarui visi dan misi");
    }
  };

  const saveHistoryEdit = async () => {
    try {
      const response = await HistoryService.updateHistory({
        text_sejarah: editForm.history,
      });

      setHistoryData({
        id: response.data.id,
        text_sejarah: response.data.text_sejarah,
        author: response.data.author,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at,
      });

      setIsEditing(false);
      toast.success("Sejarah sekolah berhasil diperbarui");
    } catch (error) {
      console.error("Gagal memperbarui sejarah sekolah:", error);
      toast.error("Gagal memperbarui sejarah sekolah");
    }
  };

  // Item Management Handlers
  const addItem = (type) => {
    if (type === "mission" && editForm.newMission.trim()) {
      setEditForm((prev) => ({
        ...prev,
        missions: [...prev.missions, prev.newMission.trim()],
        newMission: "",
      }));
    } else if (type === "goal" && editForm.newGoal.trim()) {
      setEditForm((prev) => ({
        ...prev,
        goals: [...prev.goals, prev.newGoal.trim()],
        newGoal: "",
      }));
    }
  };

  const removeItem = (type, index) => {
    if (type === "mission") {
      setEditForm((prev) => {
        const updatedMissions = [...prev.missions];
        updatedMissions.splice(index, 1);
        return { ...prev, missions: updatedMissions };
      });
    } else if (type === "goal") {
      setEditForm((prev) => {
        const updatedGoals = [...prev.goals];
        updatedGoals.splice(index, 1);
        return { ...prev, goals: updatedGoals };
      });
    }
  };

  // Loading State
  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <Spinner className="h-12 w-12" />
      <Typography variant="paragraph" className="ml-4">
        Memuat data...
      </Typography>
    </div>
  ) : (
    <div className="container mx-auto p-4">
      {/* Page Header */}
      <Typography
        variant="h2"
        className="text-2xl font-bold mb-6 text-gray-800">
        Halaman Dasboard
      </Typography>

      <StatistikSection />
      <Typography
        variant="h2"
        className="text-2xl font-bold mb-6 text-gray-800">
        Profil Sekolah
      </Typography>
      <NavigationsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ToastContainer />

      {activeTab === "vision-mission" && (
        <VisionMissionSection
          isEditing={isEditing}
          visiMisiData={visiMisiData}
          editForm={editForm}
          setEditForm={setEditForm}
          startEditing={startEditing}
          saveVisionMission={saveVisionMission}
          setIsEditing={setIsEditing}
          addItem={addItem}
          removeItem={removeItem}
        />
      )}

      {activeTab === "history" && (
        <HistorySection
          isEditing={isEditing}
          historyData={historyData}
          editForm={editForm}
          setEditForm={setEditForm}
          startEditing={startEditing}
          saveHistoryEdit={saveHistoryEdit}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default DashboardPage;
