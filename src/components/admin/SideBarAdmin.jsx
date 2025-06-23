import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  NewspaperIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CogIcon,
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../auth/AuthContext"; // ambil user dari context
import { logout } from "../../services/authService";
import logo from "../../assets/logo_sdn_gadungan02.png";

const SideBarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); // akses user dan role-nya dari context

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Berhasil logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Gagal logout");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <CogIcon className="h-5 w-5" />,
      path: "/admin/dashboard",
      roles: ["superadmin"],
    },
    {
      name: "Kelola Postingan",
      icon: <NewspaperIcon className="h-5 w-5" />,
      path: "/admin/kelola-postingan",
      roles: ["admin", "superadmin"],
    },
    {
      name: "Kelola Pengguna",
      icon: <UserGroupIcon className="h-5 w-5" />,
      path: "/admin/kelola-pengguna",
      roles: ["superadmin"],
    },
    {
      name: "Kelola Guru",
      icon: <AcademicCapIcon className="h-5 w-5" />,
      path: "/admin/kelola-guru",
      roles: ["superadmin"],
    },
    {
      name: "Kelola Panorama",
      icon: <GlobeAltIcon className="h-5 w-5" />,
      path: "/admin/kelola-virtual-tour",
      roles: ["superadmin"],
    },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
      <div className="flex-grow">
        <div className="p-4 border-b border-gray-700 text-center">
          <div className="flex items-center justify-center pb-3">
            <img src={logo} alt="Logo" className="h-[100px] w-auto" />
          </div>
          <h2 className="text-xl font-semibold">SDN GADUNGAN 02</h2>
        </div>
        <nav className="mt-4">
          {navItems
            .filter((item) => item.roles.includes(user?.role)) // filter berdasarkan role
            .map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-6 py-3 ${
                  location.pathname === item.path
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}>
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700">
        <ToastContainer />
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded">
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span className="ml-3">Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default SideBarAdmin;
