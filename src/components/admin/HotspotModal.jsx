import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
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

// Daftar kategori untuk dropdown kategori inputan

const HotspotModal = React.memo(
  ({
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
    // Perubahan: default kategori_hotspot adalah null, bukan string kosong
    const [form, setForm] = useState({
      text: "",
      description: "",
      pitch: 0,
      yaw: 0,
      targetPanoramaId: null,
      kategori_hotspot: "custom",
    });

    // Untuk menyembunyikan targetPanoramaId jika info, dan deskripsi jika custom
    const isCustom = form.kategori_hotspot === "custom";

    useEffect(() => {
      if (show) {
        const viewer = pannellumRef?.current;
        if (!viewer) return;

        const getViewerValues = () => {
          try {
            return {
              pitch: parseFloat(viewer.getPitch().toFixed(6)),
              yaw: parseFloat(viewer.getYaw().toFixed(6)),
            };
          } catch (e) {
            console.error("Gagal mendapatkan nilai dari viewer:", e);
            return { pitch: 0, yaw: 0 };
          }
        };

        const timeout = setTimeout(() => {
          const { pitch: currentPitch, yaw: currentYaw } = getViewerValues();

          if (hotspotData) {
            setForm({
              text: hotspotData.text || "",
              description: hotspotData.description || "",
              pitch: hotspotData.pitch
                ? parseFloat(hotspotData.pitch)
                : currentPitch,
              yaw: hotspotData.yaw ? parseFloat(hotspotData.yaw) : currentYaw,
              targetPanoramaId: hotspotData.targetPanoramaId || null,
              // Perubahan: jika kategori_hotspot null, tetap null, bukan string kosong
              kategori_hotspot:
                hotspotData.kategori_hotspot !== undefined &&
                hotspotData.kategori_hotspot !== ""
                  ? hotspotData.kategori_hotspot
                  : "info",
            });
          } else {
            setForm({
              text: "",
              description: "",
              pitch: currentPitch,
              yaw: currentYaw,
              targetPanoramaId: null,
              kategori_hotspot: null,
            });
          }

          if (hotspotData) {
            viewer.lookAt(
              parseFloat(hotspotData.yaw || currentYaw),
              parseFloat(hotspotData.pitch || currentPitch),
              1000
            );
          }
        }, 500);

        return () => clearTimeout(timeout);
      }
    }, [show, hotspotData, pannellumRef]);

    // Reset deskripsi jika kategori diubah ke custom
    useEffect(() => {
      // Jika kategori custom, kosongkan deskripsi (hanya jika sebelumnya ada)
      if (form.kategori_hotspot === "custom" && form.description !== "") {
        setForm((prev) => ({ ...prev, description: "" }));
      }

      // Jika kategori info, kosongkan targetPanoramaId
      if (
        form.kategori_hotspot === "info" &&
        form.targetPanoramaId !== null &&
        form.targetPanoramaId !== undefined &&
        form.targetPanoramaId !== ""
      ) {
        setForm((prev) => ({ ...prev, targetPanoramaId: null }));
      }
    }, [form.kategori_hotspot, form.description, form.targetPanoramaId]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (
        !form.text ||
        form.pitch === undefined ||
        form.yaw === undefined ||
        !form.kategori_hotspot
      ) {
        toast.error("Harap isi semua field yang wajib diisi");
        return;
      }

      try {
        // Pastikan kategori_hotspot null tetap null, bukan string kosong
        await onSave({
          ...hotspotData,
          ...form,
        });

        if (hotspotData?.id) {
          toast.success("Hotspot berhasil diupdate");
        } else {
          toast.success("Hotspot berhasil ditambahkan");
        }
      } catch (error) {
        console.error("Error:", error);
        if (hotspotData?.id) {
          toast.error("Gagal mengupdate hotspot");
        } else {
          toast.error("Gagal menambahkan hotspot");
        }
      }
    };

    return (
      <Dialog open={show} handler={onClose}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            {hotspotData?.id ? "Edit Hotspot" : "Tambah Hotspot Baru"}
          </DialogHeader>
          <DialogBody>
            <div className="space-y-4">
              <Input
                label="Judul Hotspot"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                autoFocus
                required
              />

              {/* Hanya tampilkan deskripsi jika bukan custom */}
              {!isCustom && (
                <Textarea
                  label="Deskripsi"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              )}

              {/* Dropdown kategori_hotspot */}
              <Select
                label="Pilih Kategori Hotspot"
                value={form.kategori_hotspot}
                onChange={(value) =>
                  setForm({ ...form, kategori_hotspot: value })
                }>
                <Option value="info">info (label keterangan)</Option>
                <Option value="custom">Custom (tombol navigasi)</Option>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Pitch"
                  value={form.pitch}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      pitch: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.000001"
                  required
                />
                <Input
                  type="number"
                  label="Yaw"
                  value={form.yaw}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      yaw: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.000001"
                  required
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
                  onChange={(value) =>
                    setForm({
                      ...form,
                      targetPanoramaId: value !== "" ? Number(value) : "",
                    })
                  }>
                  {panoramas
                    .filter((p) => p.id !== selectedPanorama?.id)
                    .map((p) => (
                      <Option key={p.id} value={String(p.id)}>
                        {p.nama_ruangan} ({p.hotspots?.length || 0} hotspot)
                      </Option>
                    ))}
                </Select>
              )}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => onDelete(hotspotData)}
              className="mr-1"
              disabled={isSaving}>
              <TrashIcon className="h-4 w-4 mr-1" /> Hapus
            </Button>
            <div className="flex-1"></div>
            <Button
              variant="text"
              color="blue-gray"
              onClick={onClose}
              className="mr-1"
              disabled={isSaving}>
              Batal
            </Button>
            <Button
              color="blue"
              type="submit"
              disabled={
                isSaving || !form.text.trim() || !form.kategori_hotspot
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
  }
);

export default HotspotModal;
