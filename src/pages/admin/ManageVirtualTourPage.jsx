import React, { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import HotspotModal from "../../components/admin/HotspotModal";
import PanoramaCard from "../../components/admin/PanormaCard";
import SaveModalVirtualTour from "../../components/admin/SaveModalVirtualTour";
import ModalPanorama from "../../components/admin/ModalPanorama";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
} from "@material-tailwind/react";
import { PencilIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/solid";
import VirtualTourService from "../../services/virtualtourService";
import PreviewPane from "../../components/admin/PreviewPane";

const ManageVirtualTourPage = () => {
  const [panoramas, setPanoramas] = useState([]);
  const [selectedPanorama, setSelectedPanorama] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingHotspot, setIsSavingHotspot] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showHotspotModal, setShowHotspotModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [formData, setFormData] = useState({
    nama_ruangan: "",
    gambar_panorama: "",
    hotspots: [],
  });
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const pannellumRef = useRef(null);
  const previewPannellumRef = useRef(null); // Untuk mode preview normal
  const modalPannellumRef = useRef(null); // Untuk preview di modal

  const [pendingHotspot, setPendingHotspot] = useState(null);

  const fileInputRef = useRef(null);

  const HOTSPOT_CATEGORIES = ["info", "custom"];

  useEffect(() => {
    return () => {
      [pannellumRef, previewPannellumRef, modalPannellumRef].forEach((ref) => {
        if (ref.current) {
          ref.current.destroy();
          ref.current = null;
        }
      });
    };
  }, []);

  useEffect(() => {
    // Jika ada hotspot yang menunggu untuk disimpan setelah panorama disimpan
    if (pendingHotspot && selectedPanorama?.id && !editMode) {
      // Now we can safely save the hotspot
      handleSaveHotspot(pendingHotspot);
      setPendingHotspot(null);
    }
  }, [selectedPanorama, pendingHotspot, editMode]);

  useEffect(() => {
    loadPanoramas();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Buat URL sementara untuk pratinjau
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        gambar_panorama: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      setUploadError(null);

      if (!formData.nama_ruangan.trim()) {
        throw new Error("Nama ruangan harus diisi");
      }

      if (!selectedFile && !formData.gambar_panorama) {
        throw new Error("Gambar panorama harus diunggah");
      }

      const payload = new FormData();
      payload.append("nama_ruangan", formData.nama_ruangan);
      if (selectedFile) {
        payload.append("gambar_panorama", selectedFile);
      } else if (formData.gambar_panorama.startsWith("data:")) {
        const blob = await fetch(formData.gambar_panorama).then((r) =>
          r.blob()
        );
        payload.append("gambar_panorama", blob);
      }

      let response;
      if (selectedPanorama?.id) {
        // Update existing panorama
        response = await VirtualTourService.updateVirtualTour(
          selectedPanorama.id,
          payload
        );
      } else {
        // Create new panorama
        response = await VirtualTourService.createVirtualTour(payload);
      }

      if (!response.success) {
        throw new Error(response.message || "Gagal menyimpan panorama");
      }

      // Update state dengan data baru dari server
      const savedPanorama = response.data;
      setSelectedPanorama(savedPanorama);
      setFormData({
        nama_ruangan: savedPanorama.nama_ruangan,
        gambar_panorama: savedPanorama.gambar_panorama,
        hotspots: savedPanorama.hotspots || [],
      });

      // Refresh data
      await loadPanoramas();
      setEditMode(false);
      setShowSaveModal(false);
      setSelectedFile(null);

      // If there was a pending hotspot, now we can save it
      if (pendingHotspot) {
        handleSaveHotspot(pendingHotspot);
        setPendingHotspot(null);
      }

      // Show success toast
      toast.success(
        selectedPanorama?.id
          ? "Panorama berhasil diperbarui"
          : "Panorama baru berhasil ditambahkan"
      );
    } catch (error) {
      console.error("Error menyimpan:", error);
      setUploadError(error.message || "Gagal menyimpan virtual tour");
      // Show error toast
      toast.error(error.message || "Gagal menyimpan virtual tour");
    } finally {
      setIsUploading(false);
    }
  };

  const loadPanoramas = async () => {
    try {
      const response = await VirtualTourService.getPanoramas();
      if (!response.success)
        throw new Error(response.message || "Gagal memuat panorama");

      const panoramaData = Array.isArray(response.data) ? response.data : [];
      const panoramasWithHotspots = panoramaData.map((panorama) => ({
        ...panorama,
        hotspots: (panorama.hotspots || []).map((hotspot) => ({
          ...hotspot,
          id_panorama_asal: hotspot.id_panorama_asal || panorama.id, // Pastikan id_panorama_asal ada
          // Pastikan kategori_hotspot hanya "info" atau "custom"
          kategori_hotspot: HOTSPOT_CATEGORIES.includes(
            hotspot.kategori_hotspot
          )
            ? hotspot.kategori_hotspot
            : "info",
        })),
      }));

      console.log("Loaded Panoramas:", panoramasWithHotspots); // Debugging log

      setPanoramas(panoramasWithHotspots);
    } catch (error) {
      console.error("Gagal memuat panorama:", error);
      setPanoramas([]);
      setUploadError(
        error.message || "Gagal memuat panorama. Silakan coba lagi."
      );
    }
  };

  const handleHapusPanorama = async (panorama) => {
    try {
      setIsUploading(true);
      await VirtualTourService.deleteVirtualTour(panorama.id);

      // Show success message
      setUploadError(null);

      // Reset selection if deleting the currently selected panorama
      if (selectedPanorama?.id === panorama.id) {
        setSelectedPanorama(null);
        setFormData({
          nama_ruangan: "",
          gambar_panorama: "",
          hotspots: [],
        });
      }

      // Refresh the list
      await loadPanoramas();
    } catch (error) {
      console.error("Gagal menghapus:", error);
      setUploadError(
        error.message ||
          "Gagal menghapus panorama. Pastikan tidak ada hotspot yang terkait."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Pastikan handleSelectPanorama mempertahankan semua data hotspot
  const handleSelectPanorama = useCallback((panorama) => {
    // Filter hotspot berdasarkan id_panorama_asal
    const filteredHotspots = (panorama.hotspots || [])
      .filter((hotspot) => hotspot.id_panorama_asal === panorama.id)
      .map((hotspot) => ({
        ...hotspot,
        // Pastikan kategori_hotspot hanya "info" atau "custom"
        kategori_hotspot: HOTSPOT_CATEGORIES.includes(hotspot.kategori_hotspot)
          ? hotspot.kategori_hotspot
          : "info",
      }));

    console.log("Selected Panorama:", panorama); // Debugging log
    console.log("Filtered Hotspots:", filteredHotspots); // Debugging log

    setSelectedPanorama({
      ...panorama,
      hotspots: filteredHotspots, // Hanya hotspot yang sesuai dengan panorama asal
    });

    setFormData({
      nama_ruangan: panorama.nama_ruangan,
      gambar_panorama: panorama.gambar_panorama,
      hotspots: filteredHotspots,
    });

    setEditMode(false); // Pastikan editMode di-set ke false
    setActiveHotspot(null);
  }, []);

  const handleNewPanorama = () => {
    setSelectedPanorama(null);
    setFormData({
      nama_ruangan: "",
      gambar_panorama: "",
      hotspots: [],
    });
    setEditMode(true);
    setActiveHotspot(null);
    setSelectedFile(null);
  };

  const handleAddHotspot = useCallback(
    (position) => {
      if (!pannellumRef.current || !formData.gambar_panorama) {
        alert("Harap unggah dan pilih gambar panorama terlebih dahulu");
        return;
      }

      const viewer = pannellumRef.current;

      setTimeout(() => {
        const currentPitch = viewer.getPitch();
        const currentYaw = viewer.getYaw();

        const newHotspot = {
          id_panorama_asal: selectedPanorama?.id, // Panorama asal
          pitch: position.pitch || currentPitch,
          yaw: position.yaw || currentYaw,
          text: `Hotspot ${formData.hotspots.length + 1}`,
          description: "Deskripsi di sini",
          kategori_hotspot: "info", // Default kategori_hotspot adalah "info"
          targetPanoramaId: null, // Panorama tujuan (default null)
        };

        console.log("New Hotspot:", newHotspot); // Debugging log

        setFormData((prev) => ({
          ...prev,
          hotspots: [...prev.hotspots, newHotspot],
        }));
        setActiveHotspot(newHotspot);
        setShowHotspotModal(true);

        // Fokuskan ke posisi hotspot baru
        viewer.lookAt(
          position.yaw || currentYaw,
          position.pitch || currentPitch,
          1000
        );
      }, 100);
    },
    [formData.hotspots.length, formData.gambar_panorama, selectedPanorama]
  );

  const handleAddHotspotButton = useCallback(() => {
    // eslint-disable-next-line no-undef
    if (!viewerInstance.current || !editMode) {
      // Tambahkan pengecekan editMode
      console.error("Viewer not ready or not in edit mode");
      return;
    }

    if (!pannellumRef.current || !formData.gambar_panorama) {
      alert("Harap unggah dan pilih gambar panorama terlebih dahulu");
      return;
    }

    const viewer = pannellumRef.current;
    const pitch = viewer.getPitch();
    const yaw = viewer.getYaw();

    handleAddHotspot({ pitch, yaw });
  }, [formData.gambar_panorama, handleAddHotspot]);

  // --- FIX: kategori_hotspot tidak masuk ke database ---
  const handleSaveHotspot = useCallback(
    debounce(async (updatedHotspot) => {
      try {
        setIsSavingHotspot(true);

        if (
          !updatedHotspot.text ||
          !updatedHotspot.pitch ||
          !updatedHotspot.yaw
        ) {
          throw new Error("Harap isi semua field yang wajib diisi");
        }

        // Validasi kategori_hotspot hanya boleh "info" atau "custom"
        let kategoriHotspot = HOTSPOT_CATEGORIES.includes(
          updatedHotspot.kategori_hotspot
        )
          ? updatedHotspot.kategori_hotspot
          : "info";

        let panoramaId = selectedPanorama?.id;

        // Simpan panorama jika belum disimpan
        if (!panoramaId) {
          console.log(
            "Panorama belum tersimpan. Menyimpan panorama terlebih dahulu..."
          );
          const payload = new FormData();
          payload.append("nama_ruangan", formData.nama_ruangan);
          if (selectedFile) payload.append("gambar_panorama", selectedFile);

          const panoramaResponse = await VirtualTourService.createVirtualTour(
            payload
          );
          if (!panoramaResponse.success) {
            throw new Error(
              panoramaResponse.message || "Gagal menyimpan panorama"
            );
          }

          panoramaId = panoramaResponse.data.id;
          setSelectedPanorama(panoramaResponse.data);
          console.log("Panorama berhasil disimpan:", panoramaResponse.data);
        }

        const hotspotData = {
          id_panorama_asal: panoramaId, // Gunakan ID panorama yang valid
          pitch: updatedHotspot.pitch,
          yaw: updatedHotspot.yaw,
          text: updatedHotspot.text,
          description: updatedHotspot.description || "",
          kategori_hotspot: kategoriHotspot, // Hanya "info" atau "custom"
          targetPanoramaId: updatedHotspot.targetPanoramaId || null, // Panorama tujuan
        };

        console.log("Membuat hotspot dengan data:", hotspotData);

        let savedHotspot;
        if (updatedHotspot.id) {
          const response = await VirtualTourService.updateHotspot(
            panoramaId,
            updatedHotspot.id,
            hotspotData
          );
          savedHotspot = response.data;
        } else {
          const response = await VirtualTourService.createHotspot(
            panoramaId,
            hotspotData
          );
          savedHotspot = response.data;
        }

        setFormData((prev) => ({
          ...prev,
          hotspots: [...prev.hotspots, savedHotspot],
        }));

        setActiveHotspot(savedHotspot);
        setShowHotspotModal(false);
      } catch (error) {
        console.error("Gagal menyimpan hotspot:", error);
        setUploadError(error.message || "Gagal menyimpan hotspot");
      } finally {
        setIsSavingHotspot(false);
      }
    }, 300),
    [selectedPanorama, formData, activeHotspot, selectedFile]
  );

  const handleDeleteHotspot = useCallback(async () => {
    try {
      setFormData((prev) => ({
        ...prev,
        hotspots: prev.hotspots.filter((h) => h !== activeHotspot),
      }));

      if (activeHotspot?.id && selectedPanorama?.id) {
        await VirtualTourService.deleteHotspot(
          selectedPanorama.id,
          activeHotspot.id
        );
      }

      setActiveHotspot(null);
      setShowHotspotModal(false);
    } catch (error) {
      console.error("Gagal menghapus hotspot:", error);
      setUploadError("Gagal menghapus hotspot");
    }
  }, [activeHotspot, selectedPanorama?.id]);

  const handleClearAllHotspots = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      hotspots: [],
    }));
    setActiveHotspot(null);
  }, []);
  return (
    <div className="container mx-auto p-4">
      <Typography variant="h2" className="text-2xl font-bold mb-6">
        Manajemen Virtual Tour
      </Typography>
      <ToastContainer />
      {uploadError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {uploadError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h5">Daftar Panorama</Typography>
              <Button
                onClick={handleNewPanorama}
                size="sm"
                disabled={isUploading}>
                <span className="flex items-center">
                  <PlusIcon className="h-4 w-4 mr-1" /> Tambah Scene
                </span>
              </Button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {panoramas
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .map((panorama) => (
                  <PanoramaCard
                    key={panorama.id}
                    panorama={panorama}
                    isSelected={selectedPanorama?.id === panorama.id}
                    onClick={() =>
                      !isUploading && handleSelectPanorama(panorama)
                    }
                    onDelete={handleHapusPanorama}
                  />
                ))}
            </div>
          </CardBody>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {selectedPanorama && !editMode && (
            <Card>
              <CardBody>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h4">
                    {selectedPanorama.nama_ruangan}
                  </Typography>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditMode(true)}
                      disabled={isUploading}>
                      <PencilIcon className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      onClick={() => setPreviewMode(true)}
                      disabled={isUploading}>
                      <EyeIcon className="h-4 w-4 mr-1" /> Pratinjau
                    </Button>
                  </div>
                </div>
                <div className="h-96">
                  <PreviewPane
                    pannellumRef={previewPannellumRef}
                    image={selectedPanorama.gambar_panorama}
                    hotspots={selectedPanorama.hotspots || []}
                    editMode={false}
                    panoramas={panoramas}
                    onSelectPanorama={handleSelectPanorama}
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {editMode && (
            <ModalPanorama
              selectedPanorama={selectedPanorama}
              formData={formData}
              setFormData={setFormData}
              isUploading={isUploading}
              setEditMode={setEditMode}
              handleFileChange={handleFileChange}
              fileInputRef={fileInputRef}
              handleAddHotspotButton={handleAddHotspotButton}
              handleClearAllHotspots={handleClearAllHotspots}
              activeHotspot={activeHotspot}
              setActiveHotspot={setActiveHotspot}
              setShowHotspotModal={setShowHotspotModal}
              pannellumRef={pannellumRef}
              panoramas={panoramas}
              handleAddHotspot={handleAddHotspot}
              handleSelectPanorama={handleSelectPanorama}
              setShowSaveModal={setShowSaveModal}
              hotspotCategories={HOTSPOT_CATEGORIES}
            />
          )}
        </div>
      </div>

      <Dialog
        open={previewMode}
        handler={() => setPreviewMode(false)}
        size="xl">
        <DialogHeader>
          Pratinjau Virtual Tour - {selectedPanorama?.nama_ruangan}
        </DialogHeader>
        <DialogBody className="p-0 h-[70vh]">
          <PreviewPane
            pannellumRef={modalPannellumRef}
            image={selectedPanorama?.gambar_panorama}
            hotspots={selectedPanorama?.hotspots || []}
            editMode={false}
            panoramas={panoramas}
            onSelectPanorama={handleSelectPanorama}
          />
        </DialogBody>
        <DialogFooter>
          <Button onClick={() => setPreviewMode(false)}>Tutup</Button>
        </DialogFooter>
      </Dialog>

      <HotspotModal
        show={showHotspotModal}
        onClose={() => setShowHotspotModal(false)}
        hotspotData={activeHotspot}
        panoramas={panoramas}
        selectedPanorama={selectedPanorama}
        onSave={handleSaveHotspot}
        onDelete={handleDeleteHotspot}
        isSaving={isSavingHotspot}
        pannellumRef={editMode ? pannellumRef : previewPannellumRef}
        hotspotCategories={HOTSPOT_CATEGORIES} // Berikan pilihan kategori ke modal
      />

      <SaveModalVirtualTour
        showSaveModal={showSaveModal}
        setShowSaveModal={setShowSaveModal}
        handleSave={handleSave}
        isUploading={isUploading}
      />
    </div>
  );
};

export default ManageVirtualTourPage;
