import {
  Card,
  Typography,
  Button,
  Textarea,
  CardBody,
} from "@material-tailwind/react";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export default function HistorySection({
  isEditing,
  historyData,
  editForm,
  setEditForm,
  startEditing,
  saveHistoryEdit,
  setIsEditing,
}) {
  return (
    <div>
      <Card className="mb-6">
        <CardBody>
          {isEditing !== "history" ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h4" className="font-bold">
                  Sejarah Sekolah
                </Typography>
                <Button
                  size="sm"
                  color="blue"
                  onClick={() => startEditing("history")}
                  className="flex items-center gap-2">
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <Typography className="whitespace-pre-line">
                  {historyData.text_sejarah || "Sejarah sekolah belum tersedia"}
                </Typography>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <ClockIcon className="h-4 w-4" />
                <span>
                  Terakhir diperbarui pada:{" "}
                  {new Date(
                    historyData.updatedAt || historyData.createdAt
                  ).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h4" className="font-bold">
                  Edit Sejarah Sekolah
                </Typography>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="green"
                    onClick={saveHistoryEdit}
                    className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4" />
                    Simpan
                  </Button>
                  <Button
                    size="sm"
                    color="red"
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2">
                    <XMarkIcon className="h-4 w-4" />
                    Batal
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <Textarea
                  label="Sejarah Sekolah"
                  rows={8}
                  value={editForm.history}
                  onChange={(e) =>
                    setEditForm({ ...editForm, history: e.target.value })
                  }
                  className="mb-2"
                />
                <p className="text-gray-500 text-sm">
                  Tuliskan sejarah sekolah dengan jelas dan kronologis
                </p>
              </div>

              <p className="text-gray-500 text-sm">Tips:</p>
              <ul className="list-disc pl-5 mt-1 text-sm text-gray-500">
                <li>Gunakan format paragraf yang jelas</li>
                <li>Ceritakan sejarah sekolah secara kronologis</li>
                <li>Sertakan pencapaian penting sekolah</li>
              </ul>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
