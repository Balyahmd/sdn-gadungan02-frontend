import { Outlet } from "react-router-dom";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import SidebarAdmin from "../../components/admin/SidebarAdmin";
import FooterAdmin from "../../components/admin/FooterAdmin";

const LayoutAdmin = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdmin />

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
