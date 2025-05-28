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
  UserCircleIcon,
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
      <Card
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}>
        <CardBody
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}>
          {isEditing !== "history" ? (
            /* Mode Tampilan */
            <>
              <div className="flex justify-between items-center mb-4">
                <Typography
                  variant="h4"
                  className="font-bold"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}>
                  Sejarah Sekolah
                </Typography>
                <Button
                  size="sm"
                  color="blue"
                  onClick={() => startEditing("history")}
                  className="flex items-center gap-2"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}>
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <Typography
                  className="whitespace-pre-line"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}>
                  {historyData.text_sejarah}
                </Typography>
              </div>

              {historyData?.author && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <UserCircleIcon className="h-4 w-4" />
                  <span>
                    Terakhir diperbarui oleh: {historyData.author.username} •
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
              )}
            </>
          ) : (
            /* Mode Edit */
            <>
              <div className="flex justify-between items-center mb-4">
                <Typography
                  variant="h4"
                  className="font-bold"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}>
                  Edit Sejarah Sekolah
                </Typography>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="green"
                    onClick={saveHistoryEdit}
                    className="flex items-center gap-2"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}>
                    <CheckIcon className="h-4 w-4" />
                    Simpan
                  </Button>
                  <Button
                    size="sm"
                    color="red"
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}>
                    <XMarkIcon className="h-4 w-4" />
                    Batal
                  </Button>
                </div>
              </div>

              <div className="mb-4">
                <div className="p-3 bg-gray-50 rounded mb-4">
                  {historyData.text_sejarah}
                </div>
                <Textarea
                  label="Sejarah Sekolah"
                  rows={8}
                  value={editForm.history}
                  onChange={(e) =>
                    setEditForm({ ...editForm, history: e.target.value })
                  }
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                />
              </div>

              <Typography
                variant="small"
                className="text-gray-500"
                placeholder=""
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}>
                Tips:
                <ul className="list-disc pl-5 mt-1">
                  <li>Gunakan format paragraf yang jelas</li>
                  <li>Ceritakan sejarah sekolah secara kronologis</li>
                  <li>Sertakan pencapaian penting sekolah</li>
                </ul>
              </Typography>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
