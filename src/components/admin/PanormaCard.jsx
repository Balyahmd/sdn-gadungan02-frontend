import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";

const PanoramaCard = ({
  panorama,
  isSelected,
  onClick,
  onDelete,
  isUploading,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer p-3 transition-all ${
        isSelected
          ? "bg-blue-50 border-l-4 border-blue-500"
          : "hover:bg-gray-50"
      }`}>
      <div className="flex justify-between items-start">
        <div>
          <Typography variant="h6" className="font-medium">
            {panorama.nama_ruangan}
          </Typography>
          <Typography variant="small" className="text-gray-600">
            {panorama.hotspots?.length || 0} Hotspot
          </Typography>
        </div>
        <Tooltip content="Hapus panorama">
          <IconButton
            variant="text"
            color="red"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            disabled={isUploading}>
            <TrashIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      </div>

      <Dialog
        open={showDeleteConfirm}
        handler={() => setShowDeleteConfirm(false)}
        size="xs">
        <DialogHeader>Konfirmasi Hapus</DialogHeader>
        <DialogBody>
          Apakah Anda yakin ingin menghapus "{panorama.nama_ruangan}"? Ini akan
          menghapus semua hotspot yang terkait.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setShowDeleteConfirm(false)}
            className="mr-1"
            disabled={isUploading}>
            Batal
          </Button>
          <Button
            color="red"
            onClick={() => {
              onDelete(panorama);
              setShowDeleteConfirm(false);
            }}
            disabled={isUploading}>
            {isUploading ? (
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
                Menghapus...
              </span>
            ) : (
              <>
                <TrashIcon className="h-4 w-4 mr-1" /> Hapus
              </>
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
};

export default PanoramaCard;
