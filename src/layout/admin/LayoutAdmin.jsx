import { Outlet } from "react-router-dom";
import { useState } from "react";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import SidebarAdmin from "../../components/admin/SideBarAdmin";
import FooterAdmin from "../../components/admin/FooterAdmin";

const LayoutAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="p-2 rounded-md bg-gray-800 text-white focus:outline-none">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transition-transform transform
          bg-gray-800 text-white
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
        `}>
        <SidebarAdmin />
      </div>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderAdmin />

        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <Outlet />
        </main>

        <FooterAdmin />
      </div>
    </div>
  );
};

export default LayoutAdmin;
