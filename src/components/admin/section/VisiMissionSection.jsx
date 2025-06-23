import {
  Card,
  CardBody,
  Typography,
  Button,
  Textarea,
  Input,
} from "@material-tailwind/react";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

export default function VisiMissionSection({
  isEditing,
  visiMisiData,
  editForm,
  setEditForm,
  startEditing,
  saveVisionMission,
  setIsEditing,
  addItem,
  removeItem,
}) {
  return (
    <div>
      <Card className="mb-6">
        <CardBody>
          {isEditing !== "vision-mission" ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h4" className="font-bold">
                  Visi, Misi & Tujuan
                </Typography>
                <Button
                  size="sm"
                  color="blue"
                  onClick={() => startEditing("vision-mission")}
                  className="flex items-center gap-2">
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <div className="mb-8">
                <Typography variant="h5" className="mb-2 font-semibold">
                  Visi
                </Typography>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <Typography>{visiMisiData.visi}</Typography>
                </div>
              </div>

              <div className="mb-8">
                <Typography variant="h5" className="mb-2 font-semibold">
                  Misi
                </Typography>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <ul className="list-disc pl-5 space-y-2">
                    {Array.isArray(visiMisiData.misi) ? (
                      visiMisiData.misi.map((mission, index) => (
                        <li key={index}>{mission}</li>
                      ))
                    ) : (
                      <li>{visiMisiData.misi || "Tidak ada misi"}</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Bagian Tujuan */}
              <div className="mb-4">
                <Typography variant="h5" className="mb-2 font-semibold">
                  Tujuan
                </Typography>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="list-disc pl-5 space-y-2">
                    {Array.isArray(visiMisiData.tujuan) ? (
                      visiMisiData.tujuan.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))
                    ) : (
                      <li>{visiMisiData.tujuan || "Tidak ada tujuan"}</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-sm mt-4">
                <ClockIcon className="h-4 w-4" />
                <span>
                  Terakhir diperbarui pada:{" "}
                  {new Date(
                    visiMisiData.updatedAt || visiMisiData.createdAt
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
            /* Mode Edit */
            <>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h4" className="font-bold">
                  Edit Visi, Misi & Tujuan
                </Typography>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="green"
                    onClick={saveVisionMission}
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

              {/* Edit Visi */}
              <div className="mb-6">
                <Typography variant="h5" className="mb-2 font-semibold">
                  Visi
                </Typography>
                <Textarea
                  label="Visi Sekolah"
                  value={editForm.vision}
                  onChange={(e) =>
                    setEditForm({ ...editForm, vision: e.target.value })
                  }
                  className="mb-2"
                />
                <Typography variant="small" className="text-gray-500">
                  Tuliskan visi sekolah dengan jelas dan inspiratif
                </Typography>
              </div>

              {/* Edit Misi */}
              <div className="mb-6">
                <Typography variant="h5" className="mb-2 font-semibold">
                  Misi
                </Typography>
                <div className="space-y-2 mb-4">
                  {editForm.missions.map((mission, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-full p-2 bg-gray-100 rounded">
                        {mission}
                      </span>
                      <Button
                        size="sm"
                        color="red"
                        variant="outlined"
                        onClick={() => removeItem("mission", index)}>
                        Hapus
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    label="Tambah Misi Baru"
                    value={editForm.newMission}
                    onChange={(e) =>
                      setEditForm({ ...editForm, newMission: e.target.value })
                    }
                    className="flex-grow"
                  />
                  <Button
                    onClick={() => addItem("mission")}
                    disabled={!editForm.newMission.trim()}>
                    Tambah
                  </Button>
                </div>
                <Typography variant="small" className="text-gray-500">
                  Tambahkan misi sekolah satu per satu
                </Typography>
              </div>

              {/* Edit Tujuan */}
              <div className="mb-4">
                <Typography variant="h5" className="mb-2 font-semibold">
                  Tujuan
                </Typography>
                <div className="space-y-2 mb-4">
                  {editForm.goals.map((goal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-full p-2 bg-gray-100 rounded">
                        {goal}
                      </span>
                      <Button
                        size="sm"
                        color="red"
                        variant="outlined"
                        onClick={() => removeItem("goal", index)}>
                        Hapus
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <Input
                    label="Tambah Tujuan Baru"
                    value={editForm.newGoal}
                    onChange={(e) =>
                      setEditForm({ ...editForm, newGoal: e.target.value })
                    }
                    className="flex-grow"
                  />
                  <Button
                    onClick={() => addItem("goal")}
                    disabled={!editForm.newGoal.trim()}>
                    Tambah
                  </Button>
                </div>
                <Typography variant="small" className="text-gray-500">
                  Tambahkan tujuan yang ingin dicapai sekolah
                </Typography>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
