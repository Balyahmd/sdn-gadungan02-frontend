import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import TeacherService from "../../services/teacherService";
import imagePeople from "../../assets/image_people.jpg";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
  IconButton,
  Avatar,
  Spinner,
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
  UserCircleIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { Pagination } from "../../components/Pagination";

const ManageTeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTeacher, setCurrentTeacher] = useState({
    id: "",
    nama_guru: "",
    pas_foto: "",
    nip: "",
    keterangan_guru: "",
  });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await TeacherService.getTeachers(searchTerm);
      setTeachers(response.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTeachers();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleOpenModal = (teacher = null) => {
    if (teacher) {
      setCurrentTeacher(teacher);
      setImagePreview(teacher.pas_foto || "");
      setIsEditing(true);
    } else {
      setCurrentTeacher({
        id: "",
        nama_guru: "",
        pas_foto: "",
        nip: "",
        keterangan_guru: "",
      });
      setImagePreview("");
      setImageFile(null);
      setIsEditing(false);
    }
    setErrors({});
    setOpenModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!currentTeacher.nama_guru) newErrors.nama_guru = "Nama wajib diisi";
    if (!currentTeacher.nip) newErrors.nip = "NIP wajib diisi";
    if (currentTeacher.nip && isNaN(currentTeacher.nip))
      newErrors.nip = "NIP harus berupa angka";
    if (!currentTeacher.keterangan_guru)
      newErrors.keterangan_guru = "Keterangan guru wajib diisi";
    return newErrors;
  };

  const handleSaveTeacher = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("nama_guru", currentTeacher.nama_guru.trim());
      formData.append("nip", currentTeacher.nip.trim());
      formData.append("keterangan_guru", currentTeacher.keterangan_guru.trim());

      if (imageFile) {
        formData.append("pas_foto", imageFile);
      } else if (isEditing && currentTeacher.pas_foto) {
        formData.append("keepExistingImage", "true");
      }

      await (isEditing
        ? TeacherService.updateTeacher(currentTeacher.id, formData)
        : TeacherService.createTeacher(formData));
      toast.success(`Guru berhasil ${isEditing ? "diupdate" : "ditambahkan"}`);

      await fetchTeachers();
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving teacher:", error);
      toast.error(
        error.response?.data?.message ||
          `Gagal ${isEditing ? "mengupdate" : "menambahkan"} guru`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async () => {
    try {
      await TeacherService.deleteTeacher(teacherToDelete);
      setTeachers(teachers.filter((t) => t.id !== teacherToDelete));
      setOpenDeleteModal(false);
      toast.success("Guru berhasil dihapus");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("Gagal menghapus guru");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTeacher({ ...currentTeacher, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <Typography variant="h2" className="text-2xl font-bold mb-6">
        Manajemen Guru
      </Typography>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-1/2">
          <Input
            label="Cari Guru..."
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => handleOpenModal()}>
          <PlusIcon className="h-5 w-5" /> Tambah Guru
        </Button>
      </div>

      <Card>
        <CardBody>
          {teachers.length === 0 ? (
            <Typography className="text-center py-8">
              Tidak ada data guru ditemukan
            </Typography>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto">
                <thead>
                  <tr>
                    {[
                      "No",
                      "Foto",
                      "Nama",
                      "NIP/NIPPPK",
                      "Keterangan",
                      "Aksi",
                    ].map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          className="font-normal leading-none opacity-70">
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teachers
                    .sort(
                      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                    )
                    .slice((currentPage - 1) * 5, currentPage * 5)
                    .map((teacher, index) => (
                      <tr
                        key={teacher.id}
                        className="border-b border-blue-gray-100">
                        <td className="p-4">
                          {(currentPage - 1) * 5 + index + 1}
                        </td>
                        <td className="p-4">
                          <Avatar
                            src={teacher.pas_foto || imagePeople}
                            alt={teacher.nama_guru}
                            size="md"
                            className="border border-gray-300"
                          />
                        </td>
                        <td className="p-4">
                          <Typography variant="small" className="font-medium">
                            {teacher.nama_guru}
                          </Typography>
                        </td>
                        <td className="p-4">{teacher.nip}</td>
                        <td className="p-4">{teacher.keterangan_guru}</td>

                        <td className="p-4">
                          <div className="flex gap-2">
                            <Tooltip content="Edit">
                              <IconButton
                                variant="text"
                                color="blue"
                                onClick={() => handleOpenModal(teacher)}>
                                <PencilIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Hapus">
                              <IconButton
                                variant="text"
                                color="red"
                                onClick={() => {
                                  setTeacherToDelete(teacher.id);
                                  setOpenDeleteModal(true);
                                }}>
                                <TrashIcon className="h-5 w-5" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="mt-8 flex justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(teachers.length / 5)}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={openModal} handler={() => setOpenModal(false)} size="xl">
        <DialogHeader>
          {isEditing ? "Edit Data Guru" : "Tambah Guru Baru"}
        </DialogHeader>
        <DialogBody divider className="grid gap-4">
          <div>
            <Typography variant="h6" className="mb-2">
              Pas Foto
            </Typography>
            <div className="flex items-center gap-4">
              <Avatar
                src={imagePreview || "/default-avatar.jpg"}
                alt="Preview Foto"
                size="xxl"
                className="border-2 border-gray-300"
              />
              <div>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div className="relative">
                  <Button
                    variant="outlined"
                    color="blue"
                    className="flex items-center gap-2">
                    <PhotoIcon className="h-5 w-5" />
                    {imagePreview ? "Ganti Foto" : "Upload Foto"}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <Input
            label="Nama Lengkap *"
            name="nama_guru"
            value={currentTeacher.nama_guru}
            onChange={handleChange}
            error={!!errors.nama_guru}
            icon={<UserCircleIcon className="h-5 w-5" />}
          />
          {errors.nama_guru && (
            <Typography color="red" variant="small">
              {errors.nama_guru}
            </Typography>
          )}
          <Input
            label="NIP(Nomor Induk Pegawai)/NIPPPK(Nomor Induk Pegawai Pemerintah dengan Perjanjian Kerja)"
            name="nip"
            value={currentTeacher.nip}
            onChange={handleChange}
            error={!!errors.nip}
          />
          {errors.nip && (
            <Typography color="red" variant="small">
              {errors.nip}
            </Typography>
          )}

          <Textarea
            label="Keterangan (Jabatan/Mata Pelajaran)"
            name="keterangan_guru"
            value={currentTeacher.keterangan_guru}
            onChange={handleChange}
            rows={3}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpenModal(false)}
            className="mr-1"
            disabled={isSubmitting}>
            <XMarkIcon className="h-5 w-5" /> Batal
          </Button>
          <Button
            color="green"
            onClick={handleSaveTeacher}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Menyimpan...
              </div>
            ) : (
              <>
                <CheckIcon className="h-5 w-5" />{" "}
                {isEditing ? "Update" : "Simpan"}
              </>
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(false)}>
        <DialogHeader>Konfirmasi Hapus</DialogHeader>
        <DialogBody>
          Apakah Anda yakin ingin menghapus data guru ini?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setOpenDeleteModal(false)}
            className="mr-1">
            Batal
          </Button>
          <Button color="red" onClick={handleDeleteTeacher}>
            Hapus
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ManageTeacherPage;
