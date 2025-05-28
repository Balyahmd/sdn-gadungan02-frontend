import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
  IconButton,
  Chip,
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  UserCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Pagination } from "../../components/Pagination";

import api from "../../utils/api.js";

const ManageUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  const [currentPage] = useState(1);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      console.log(response.data.length);
      setUsers(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setCurrentUser({
        ...user,
        password: "",
      });
      setIsEditing(true);
    } else {
      setCurrentUser({
        username: "",
        email: "",
        password: "",
        role: "admin",
      });
      setIsEditing(false);
    }
    setErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenDeleteModal = (id) => {
    setUserToDelete(id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setUserToDelete(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value,
    });
  };

  const setStateValue = (key, value) => {
    setCurrentUser((prev) => ({ ...prev, [key]: value }));
  };
  const validateForm = () => {
    const newErrors = {};

    // Validasi username
    if (!currentUser.username?.trim()) {
      newErrors.username = "Username wajib diisi";
    } else if (currentUser.username.length < 4) {
      newErrors.username = "Username minimal 4 karakter";
    }

    // Validasi email
    if (!currentUser.email?.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentUser.email)) {
      newErrors.email = "Format email tidak valid";
    }

    // Validasi password hanya saat bukan editing
    if (!isEditing) {
      if (!currentUser.password?.trim()) {
        newErrors.password = "Password wajib diisi";
      } else if (currentUser.password.length < 6) {
        newErrors.password = "Password minimal 6 karakter";
      }
    }

    return newErrors;
  };

  const handleSaveUser = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      if (isEditing) {
        // eslint-disable-next-line no-undef
        await api.put(`/users/${currentUser.id}`, currentUser);
        toast.success("User berhasil diupdate");
      } else {
        // eslint-disable-next-line no-undef
        await api.post("/users", currentUser);
        toast.success("User berhasil ditambahkan");
      }

      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(
        error.response?.data?.message ||
          `Gagal ${isEditing ? "mengupdate" : "menambahkan"} user`
      );
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/users/${userToDelete}`);

      toast.success("User deleted successfully");
      fetchUsers();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <Dialog open={openModal} handler={handleCloseModal} size="md">
        <DialogHeader>
          {isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        </DialogHeader>
        <DialogBody divider className="grid gap-4">
          <Input
            label="Nama Lengkap"
            name="username"
            value={currentUser.username}
            onChange={handleChange}
            error={!!errors.username}
            icon={<UserCircleIcon className="h-5 w-5" />}
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.username}</span>
          )}

          <Input
            label="Email"
            name="email"
            value={currentUser.email}
            onChange={handleChange}
            error={!!errors.email}
            icon={<EnvelopeIcon className="h-5 w-5" />}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              name="password"
              value={currentUser.password}
              onChange={handleChange}
              error={!!errors.password}
              // icon={<LockClosedIcon className="h-5 w-5" />}
              className="pr-10" // berikan padding agar tidak tertutup tombol
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}

          <Select
            label="Role"
            value={currentUser.role}
            onChange={(value) =>
              setCurrentUser({ ...currentUser, role: value })
            }>
            <Option value="superadmin">Super Admin</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleCloseModal}
            className="mr-1">
            <XMarkIcon className="h-5 w-5 mr-1" /> Batal
          </Button>
          <Button color="green" onClick={handleSaveUser}>
            <CheckIcon className="h-5 w-5 mr-1" />{" "}
            {isEditing ? "Update" : "Simpan"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal Hapus */}
      <Dialog open={openDeleteModal} handler={handleCloseDeleteModal} size="sm">
        <DialogHeader>Konfirmasi Hapus</DialogHeader>
        <DialogBody>
          Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak
          dapat dibatalkan.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={handleCloseDeleteModal}>
            Batal
          </Button>
          <Button color="red" onClick={handleDeleteUser}>
            Hapus
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Konten Utama */}
      <Typography variant="h2" className="text-2xl font-bold mb-6">
        Manajemen Pengguna
      </Typography>

      <Card className="mb-6">
        <CardBody>
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h5" className="font-bold">
              Daftar Pengguna
            </Typography>
            <Button
              className="flex items-center gap-2"
              onClick={() => handleOpenModal()}>
              <PlusIcon className="h-5 w-5" /> Tambah Pengguna
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Typography>Loading...</Typography>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr>
                    {["No", "Username", "Role", "Aksi"].map((head) => (
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
                  {users.length > 0 ? (
                    users
                      .slice((currentPage - 1) * 5, currentPage * 5)
                      .map((user, index) => (
                        <tr
                          key={user.id}
                          className="border-b border-blue-gray-100">
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4">{user.username}</td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4">
                            <Chip
                              value={user.role}
                              color={
                                user.role === "superadmin"
                                  ? "amber"
                                  : user.role === "admin"
                                  ? "blue"
                                  : "green"
                              }
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Tooltip content="Edit">
                                <IconButton
                                  variant="text"
                                  color="blue"
                                  onClick={() => handleOpenModal(user)}>
                                  <PencilIcon className="h-5 w-5" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip content="Hapus">
                                <IconButton
                                  variant="text"
                                  color="red"
                                  onClick={() =>
                                    handleOpenDeleteModal(user.id)
                                  }>
                                  <TrashIcon className="h-5 w-5" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">
                        Tidak ada data pengguna
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mt-4 mb-8 flex justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(users.length / 5)}
                  onPageChange={(page) => setStateValue("currentPage", page)}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ManageUserPage;
