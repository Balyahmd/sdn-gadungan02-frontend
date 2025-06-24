import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const HotspotModal = ({
  show,
  onClose,
  hotspotData,
  panoramas,
  selectedPanorama,
  onSave,
  onDelete,
  isSaving,
  pannellumRef,
}) => {
  const [form, setForm] = useState({
    text: "",
    description: "",
    pitch: 0,
    yaw: 0,
    targetPanoramaId: null,
    kategori_hotspot: "",
  });
  const [errors, setErrors] = useState({});

  // Helper untuk update field form
  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Reset form saat modal dibuka
  useEffect(() => {
    if (show) {
      const viewer = pannellumRef?.current;
      const getViewerValues = () => {
        try {
          return {
            pitch: parseFloat(viewer?.getPitch?.().toFixed(6)) || 0,
            yaw: parseFloat(viewer?.getYaw?.().toFixed(6)) || 0,
          };
        } catch {
          return { pitch: 0, yaw: 0 };
        }
      };
      const { pitch: currentPitch, yaw: currentYaw } = getViewerValues();

      if (hotspotData) {
        setForm({
          text: hotspotData?.text ?? "",
          description: hotspotData?.description ?? "",
          pitch:
            hotspotData?.pitch !== undefined && hotspotData?.pitch !== null
              ? parseFloat(hotspotData.pitch)
              : currentPitch,
          yaw:
            hotspotData?.yaw !== undefined && hotspotData?.yaw !== null
              ? parseFloat(hotspotData.yaw)
              : currentYaw,
          targetPanoramaId:
            hotspotData?.targetPanoramaId !== undefined
              ? hotspotData.targetPanoramaId
              : null,
          // Pastikan kategori_hotspot selalu string, tidak null/undefined
          kategori_hotspot:
            hotspotData?.kategori_hotspot !== undefined &&
            hotspotData?.kategori_hotspot !== null
              ? String(hotspotData.kategori_hotspot)
              : "",
        });
        // Look at hotspot position
        if (
          viewer &&
          (hotspotData?.pitch !== undefined || hotspotData?.yaw !== undefined)
        ) {
          viewer.lookAt(
            parseFloat(
              hotspotData?.yaw !== undefined ? hotspotData.yaw : currentYaw
            ),
            parseFloat(
              hotspotData?.pitch !== undefined
                ? hotspotData.pitch
                : currentPitch
            ),
            1000
          );
        }
      } else {
        setForm({
          text: "",
          description: "",
          pitch: currentPitch,
          yaw: currentYaw,
          targetPanoramaId: null,
          kategori_hotspot: "",
        });
      }
      setErrors({});
    }
  }, [show, hotspotData, pannellumRef]);

  // Reset deskripsi jika kategori diubah ke custom, dan targetPanoramaId jika info
  useEffect(() => {
    if (form.kategori_hotspot === "custom" && form.description !== "") {
      setField("description", "");
    }
    if (
      form.kategori_hotspot === "info" &&
      form.targetPanoramaId !== null &&
      form.targetPanoramaId !== undefined &&
      form.targetPanoramaId !== ""
    ) {
      setField("targetPanoramaId", null);
    }
    // eslint-disable-next-line
  }, [form.kategori_hotspot]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.text.trim()) newErrors.text = "Judul wajib diisi";
    if (!form.kategori_hotspot || form.kategori_hotspot === "")
      newErrors.kategori_hotspot = "Kategori wajib diisi";
    if (form.kategori_hotspot === "custom" && !form.targetPanoramaId) {
      newErrors.targetPanoramaId = "Target scene wajib dipilih";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setField(name, value === "" ? "" : parseFloat(value));
  };

  const handleKategoriChange = (value) => {
    setField("kategori_hotspot", value);
  };

  const handleTargetPanoramaChange = (value) => {
    setField("targetPanoramaId", value !== "" ? Number(value) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    try {
      // Pastikan kategori_hotspot tidak null/undefined, selalu string
      const kategori_hotspot =
        form.kategori_hotspot !== undefined && form.kategori_hotspot !== null
          ? String(form.kategori_hotspot)
          : "";
      await onSave({
        ...hotspotData,
        ...form,
        kategori_hotspot, // override to ensure always string
      });
      toast.success(
        hotspotData?.id
          ? "Hotspot berhasil diupdate"
          : "Hotspot berhasil ditambahkan"
      );
    } catch {
      toast.error(
        hotspotData?.id
          ? "Gagal mengupdate hotspot"
          : "Gagal menambahkan hotspot"
      );
    }
  };

  const isCustom = form.kategori_hotspot === "custom";

  return (
    <Dialog open={show} handler={onClose} size="md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          {hotspotData?.id ? "Edit Hotspot" : "Tambah Hotspot Baru"}
        </DialogHeader>
        <DialogBody divider className="grid gap-4">
          <Input
            label="Judul Hotspot"
            name="text"
            value={form.text}
            onChange={handleChange}
            autoFocus
            required
            error={!!errors.text}
          />
          {errors.text && (
            <span className="text-red-500 text-sm">{errors.text}</span>
          )}

          {/* Hanya tampilkan deskripsi jika bukan custom */}
          {!isCustom && (
            <Textarea
              label="Deskripsi"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          )}

          <Select
            label="Pilih Kategori Hotspot"
            value={form.kategori_hotspot || ""}
            onChange={handleKategoriChange}
            error={!!errors.kategori_hotspot}>
            <Option key="hotspot-cat-info" value="info">
              info (label keterangan)
            </Option>
            <Option key="hotspot-cat-custom" value="custom">
              Custom (tombol navigasi)
            </Option>
          </Select>
          {errors.kategori_hotspot && (
            <span className="text-red-500 text-sm">
              {errors.kategori_hotspot}
            </span>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Pitch"
              name="pitch"
              value={form.pitch}
              onChange={handleNumberChange}
              step="0.000001"
              required
              error={!!errors.pitch}
            />
            <Input
              type="number"
              label="Yaw"
              name="yaw"
              value={form.yaw}
              onChange={handleNumberChange}
              step="0.000001"
              required
              error={!!errors.yaw}
            />
          </div>

          {/* Tampilkan targetPanoramaId hanya jika kategori custom */}
          {isCustom && (
            <Select
              label="Pilih Target Scene"
              value={
                form.targetPanoramaId !== null &&
                form.targetPanoramaId !== undefined
                  ? String(form.targetPanoramaId)
                  : ""
              }
              onChange={handleTargetPanoramaChange}
              error={!!errors.targetPanoramaId}>
              {panoramas
                .filter((p) => p.id !== selectedPanorama?.id)
                .map((p) => (
                  <Option key={p.id} value={String(p.id)}>
                    {p.nama_ruangan} ({p.hotspots?.length || 0} hotspot)
                  </Option>
                ))}
            </Select>
          )}
          {errors.targetPanoramaId && (
            <span className="text-red-500 text-sm">
              {errors.targetPanoramaId}
            </span>
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => onDelete(hotspotData)}
            className="mr-1"
            disabled={isSaving || !hotspotData?.id}
            type="button">
            <TrashIcon className="h-4 w-4 mr-1" /> Hapus
          </Button>
          <div className="flex-1"></div>
          <Button
            variant="text"
            color="blue-gray"
            onClick={onClose}
            className="mr-1"
            disabled={isSaving}
            type="button">
            Batal
          </Button>
          <Button
            color="blue"
            type="submit"
            disabled={
              isSaving ||
              !form.text.trim() ||
              !form.kategori_hotspot ||
              (isCustom && !form.targetPanoramaId)
            }>
            {isSaving ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </span>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-1" /> Simpan
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default HotspotModal;
