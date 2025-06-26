import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import api from "../../utils/api";

const ManageUserPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (!userId) {
          toast.error("User ID tidak ditemukan. Silakan login ulang.");
          setLoading(false);
          return;
        }
        const res = await api.get(`/users/${userId}`);
        // Pastikan data user ada
        if (!res.data || !res.data.data) {
          toast.error("Data user tidak ditemukan.");
          setCurrentUser({
            id: "",
            username: "",
            email: "",
            password: "",
            role: "",
          });
        } else {
          setCurrentUser({ ...res.data.data, password: "" });
        }
      } catch {
        toast.error("Gagal mengambil data pengguna");
        setCurrentUser({
          id: "",
          username: "",
          email: "",
          password: "",
          role: "",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!currentUser.username) {
      newErrors.username = "Username wajib diisi";
    } else if (currentUser.username.length < 5) {
      newErrors.username = "Username minimal 5 karakter";
    }
    if (!currentUser.email) newErrors.email = "Email wajib diisi";
    // Validasi email sederhana
    if (
      currentUser.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(currentUser.email)
    ) {
      newErrors.email = "Format email tidak valid";
    }
    // Validasi password jika diisi
    if (currentUser.password && currentUser.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Jangan kirim password jika kosong
      const payload = { ...currentUser };
      if (!payload.password) {
        delete payload.password;
      }
      await api.put(`/users/${currentUser.id}`, payload);
      toast.success("Data akun berhasil diperbarui");
      setCurrentUser((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Gagal memperbarui data akun");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-xl flex justify-center items-center h-96">
        <Typography variant="h6">Memuat data akun...</Typography>
      </div>
    );
  }

  // Jika currentUser null, tampilkan pesan error
  if (!currentUser) {
    return (
      <div className="container mx-auto p-4 max-w-xl flex justify-center items-center h-96">
        <Typography variant="h6" color="red">
          Data user tidak ditemukan.
        </Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <ToastContainer />
      <Typography variant="h4" className="mb-6 font-bold">
        Kelola Akun Saya
      </Typography>
      <Card>
        <CardBody className="grid gap-4">
          <div>
            <Input
              label="Username"
              name="username"
              value={currentUser.username}
              onChange={handleChange}
              error={!!errors.username}
              autoComplete="username"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">{errors.username}</span>
            )}
          </div>

          <div>
            <Input
              label="Email"
              name="email"
              value={currentUser.email}
              onChange={handleChange}
              error={!!errors.email}
              autoComplete="email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password Baru"
              name="password"
              value={currentUser.password}
              onChange={handleChange}
              className="pr-10"
              autoComplete="new-password"
              error={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
              tabIndex={-1}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1">
                {errors.password}
              </span>
            )}
          </div>

          <Button
            color="green"
            onClick={handleSubmit}
            className="mt-2 py-3 rounded-xl text-base font-bold bg-green-700 shadow-lg hover:bg-green-800 transition-all"
            ripple="light"
            fullWidth>
            Simpan Perubahan
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default ManageUserPage;
