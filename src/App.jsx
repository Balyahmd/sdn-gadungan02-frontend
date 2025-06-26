import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/HomePage";
import FeedPage from "./pages/user/FeedPage";
import DetailFeedPage from "./pages/user/DetailFeedPage";
import HistoryPage from "./pages/user/HistoryPage";
import VirtualTourPage from "./pages/user/VirtualTourPage";
import VisiMisiPage from "./pages/user/VisiMisiPage";
import HeadSpeechPage from "./pages/user/HeadSpeechPage";
import LoginPage from "./pages/admin/LoginPage";
import ManagePostPage from "./pages/admin/ManagePostPage";
import ManageVirtualTourPage from "./pages/admin/ManageVirtualTourPage";
import LayoutAdmin from "./layout/admin/LayoutAdmin";
import DashboardPage from "./pages/admin/DashboardPage";
import ManageTeacherPage from "./pages/admin/ManageTeacherPage";
import ManageUserPage from "./pages/admin/ManageUserPage";
import RequireAuth from "./components/auth/RequireAuth";
import Layout from "./layout/user/Layout";
import TeacherPage from "./pages/user/TeacherPage";
import "./App.css";
import NotFoundPage from "./components/NotFoundPage";
import { useState } from "react";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <SplashScreen onComplete={() => setLoading(false)} />;
  }
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="postingan" element={<FeedPage />} />
        <Route path="postingan/:id" element={<DetailFeedPage />} />
        <Route path="sejarah-sekolah" element={<HistoryPage />} />
        <Route path="virtual-tour" element={<VirtualTourPage />} />
        <Route path="visi-misi" element={<VisiMisiPage />} />
        <Route path="sambutan-kepala-sekolah" element={<HeadSpeechPage />} />
        <Route path="daftar-guru" element={<TeacherPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="/admin" element={<LayoutAdmin />}>
        <Route
          path="kelola-postingan"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <ManagePostPage />
            </RequireAuth>
          }
        />
        <Route
          path="dashboard"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <DashboardPage path="dashboard" />
            </RequireAuth>
          }
        />
        <Route
          path="kelola-akun"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <ManageUserPage />
            </RequireAuth>
          }
        />
        <Route
          path="kelola-guru"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <ManageTeacherPage path="teacher" />
            </RequireAuth>
          }
        />
        <Route
          path="kelola-virtual-tour"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <ManageVirtualTourPage path="kelola-virtual-tour" />
            </RequireAuth>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
