import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { CheckIcon } from "@heroicons/react/24/solid";

const SaveModalVirtualTour = ({
  showSaveModal,
  setShowSaveModal,
  handleSave,
  isUploading,
}) => (
  <Dialog open={showSaveModal} handler={() => setShowSaveModal(false)}>
    <DialogHeader>Konfirmasi Perubahan</DialogHeader>
    <DialogBody>
      Apakah Anda yakin ingin menyimpan perubahan ini? Ini akan memperbarui
      virtual tour.
    </DialogBody>
    <DialogFooter>
      <Button
        variant="text"
        color="blue-gray"
        onClick={() => setShowSaveModal(false)}
        className="mr-1">
        Batal
      </Button>
      <Button color="green" onClick={handleSave} disabled={isUploading}>
        {isUploading ? (
          "Menyimpan..."
        ) : (
          <>
            <CheckIcon className="h-4 w-4 mr-1" /> Simpan
          </>
        )}
      </Button>
    </DialogFooter>
  </Dialog>
);

export default SaveModalVirtualTour;
