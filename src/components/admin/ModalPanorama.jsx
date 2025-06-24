import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Chip,
} from "@material-tailwind/react";
import {
  ArrowLeftIcon,
  PhotoIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import PreviewPane from "./PreviewPane";

const ModalPanorama = ({
  selectedPanorama,
  formData,
  setFormData,
  isUploading,
  setEditMode,
  handleFileChange,
  fileInputRef,
  handleClearAllHotspots,
  activeHotspot,
  setActiveHotspot,
  setShowHotspotModal,
  pannellumRef,
  panoramas,
  handleAddHotspot,
  handleSelectPanorama,
  setShowSaveModal,
  hotspotCategories = [],
}) => {
  return (
    <Card>
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h4">
            {selectedPanorama ? "Panorama" : "Buat Panorama Baru"}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              onClick={() => setEditMode(false)}
              disabled={isUploading}
              type="button">
              <div className="flex items-center justify-center w-full">
                <ArrowLeftIcon className="h-4 w-4 mr-1" /> Kembali
              </div>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Nama Ruangan"
              value={formData.nama_ruangan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nama_ruangan: e.target.value,
                })
              }
              disabled={isUploading}
            />

            <div className="space-y-2">
              <input
                type="file"
                id="panorama-upload"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                disabled={isUploading}
              />
              <Button
                variant="outlined"
                color="blue"
                fullWidth
                className="flex items-center gap-2"
                disabled={isUploading}
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
                type="button">
                <PhotoIcon className="h-5 w-5" />
                Unggah Gambar Panorama
              </Button>
            </div>

            <div className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <Typography variant="h6">
                  Hotspot ({formData.hotspots.length})
                </Typography>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    color="red"
                    size="sm"
                    onClick={handleClearAllHotspots}
                    disabled={isUploading || formData.hotspots.length === 0}
                    type="button">
                    <span className="flex items-center gap-2">
                      <TrashIcon className="h-4 w-4 mx-auto" />
                      Hapus Semua
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {formData.hotspots.map((hotspot, index) => {
                  const pitch =
                    typeof hotspot.pitch === "number"
                      ? hotspot.pitch
                      : parseFloat(hotspot.pitch) || 0;
                  const yaw =
                    typeof hotspot.yaw === "number"
                      ? hotspot.yaw
                      : parseFloat(hotspot.yaw) || 0;

                  // Tampilkan kategori hotspot jika ada
                  const kategori =
                    hotspot.kategori_hotspot &&
                    hotspotCategories.includes(hotspot.kategori_hotspot)
                      ? hotspot.kategori_hotspot
                      : undefined;

                  return (
                    <Chip
                      key={hotspot.id || index}
                      value={
                        `${hotspot.text || "Hotspot"} (${pitch.toFixed(
                          1
                        )}, ${yaw.toFixed(1)})` +
                        (kategori ? ` [${kategori}]` : "")
                      }
                      color={activeHotspot?.id === hotspot.id ? "blue" : "gray"}
                      onClick={() => {
                        setActiveHotspot(hotspot);
                        setShowHotspotModal(true);
                      }}
                      onDoubleClick={() => {
                        if (pannellumRef.current && formData.gambar_panorama) {
                          pannellumRef.current.lookAt(yaw, pitch, 1000);
                        }
                      }}
                      className="cursor-pointer"
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="h-96">
            <PreviewPane
              pannellumRef={pannellumRef}
              image={formData.gambar_panorama}
              hotspots={formData.hotspots}
              editMode={true}
              onAddHotspot={handleAddHotspot}
              panoramas={panoramas}
              onSelectPanorama={handleSelectPanorama}
            />
          </div>
        </div>
      </CardBody>

      <CardBody className="pt-0">
        <div className="flex justify-end gap-2">
          <Button
            variant="outlined"
            color="red"
            onClick={() => setEditMode(false)}
            disabled={isUploading}
            type="button">
            <span className="flex items-center justify-center">
              <XMarkIcon className="h-4 w-4 mr-1" />
              Batal
            </span>
          </Button>
          <Button
            color="green"
            onClick={() => setShowSaveModal(true)}
            disabled={isUploading}
            type="button">
            <span className="flex items-center justify-center w-full">
              <CheckIcon className="h-4 w-4 mr-1" /> Simpan
            </span>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ModalPanorama;
