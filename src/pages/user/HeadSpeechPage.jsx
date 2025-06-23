import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  Avatar,
  Button,
} from "@material-tailwind/react";
import {
  AcademicCapIcon,
  UserGroupIcon,
  TrophyIcon,
  BookOpenIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import Teachers from "../../assets/Guru.jpeg";
import TeacherService from "../../services/teacherService";
import PostService from "../../services/postService";

const HeadSpeechPage = () => {
  // Data guru contoh
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm] = useState("");
  const [posts, setPosts] = useState([]);

  // Fungsi fetch data guru dari API/service
  const fetchTeachers = async (keyword = "") => {
    try {
      setLoading(true);
      const response = await TeacherService.getTeachers(keyword);
      setTeachers(response.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await PostService.getPosts();
      setPosts(response.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(searchTerm);
  }, [searchTerm]);

  // useEffect dengan debounce sederhana untuk searchTerm
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTeachers(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);
  if (loading)
    return (
      <div className="text-center py-10">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-300px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4">
            <AcademicCapIcon className="h-8 w-8 text-green-700" />
          </div>
          <Typography
            variant="h1"
            className="text-4xl font-bold text-gray-900 mb-2">
            Sambutan Kepala Sekolah
          </Typography>
          <Typography variant="lead" className="text-green-700">
            SD Negeri Gadungan 02
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content - Sambutan */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg overflow-hidden">
              <div className="relative h-64 bg-gray-800">
                <img
                  src={Teachers}
                  alt="Gedung SDN Gadungan 02"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <Typography
                    variant="h3"
                    className="text-white text-2xl font-bold">
                    Kata Sambutan
                  </Typography>
                </div>
              </div>

              <CardBody className="p-8">
                {teachers
                  .filter((teacher) =>
                    teacher.keterangan_guru
                      .toLowerCase()
                      .includes("kepala sekolah")
                  )
                  .map((teacher, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-10 items-center mb-10">
                      <div className="relative mx-5">
                        <Avatar
                          src={teacher.pas_foto}
                          alt={teacher.nama_guru}
                          size="xxl"
                          className="border-4 border-white shadow-lg object-cover"
                        />
                        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-4 py-1 rounded-full shadow-sm">
                          <Typography
                            variant="small"
                            className="font-bold flex items-center gap-1 whitespace-nowrap">
                            <UserGroupIcon className="h-6 w-6 pr-1" />
                            {teacher.keterangan_guru}
                          </Typography>
                        </div>
                      </div>
                      <div className="text-center md:text-left">
                        <Typography
                          variant="h3"
                          className="text-2xl font-bold text-gray-900 mb-1">
                          {teacher.nama_guru}
                        </Typography>
                        <Typography
                          variant="paragraph"
                          className="text-gray-600 mb-4">
                          {teacher.keterangan_guru} SDN Gadungan 02
                        </Typography>
                        <div className="flex justify-center md:justify-start">
                          <Link to="/sejarah-sekolah">
                            <Button
                              variant="filled"
                              className="flex items-center gap-2 bg-green-700">
                              <BookOpenIcon className="h-5 w-5" />
                              Profil Lengkap
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                <div className="space-y-6">
                  <Typography
                    variant="paragraph"
                    className="text-gray-700 text-lg leading-relaxed">
                    <span className="text-4xl font-bold text-green-700 float-left mr-2 mt-1">
                      S
                    </span>
                    elamat datang di SDN Gadungan 02, sekolah yang berkomitmen
                    untuk mencetak generasi yang cerdas, berkarakter, dan mampu
                    menghadapi tantangan global. Kami percaya bahwa pendidikan
                    yang berkualitas adalah kunci untuk membangun masa depan
                    yang cerah.
                  </Typography>

                  <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-700 flex items-start gap-4">
                    <AcademicCapIcon className="h-6 w-6 text-green-700 mt-1 flex-shrink-0" />
                    <Typography
                      variant="paragraph"
                      className="text-green-700 italic font-medium">
                      "Dengan memanfaatkan teknologi sebagai alat bantu dalam
                      proses pembelajaran, kami berusaha memberikan pengalaman
                      belajar yang lebih interaktif dan menyenangkan bagi
                      siswa."
                    </Typography>
                  </div>

                  <Typography
                    variant="paragraph"
                    className="text-gray-700 text-lg leading-relaxed">
                    Kami juga berkomitmen untuk menyediakan informasi yang
                    transparan dan mudah diakses oleh seluruh warga sekolah dan
                    masyarakat. Semoga dengan kerjasama yang baik di antara
                    kita, kita bisa bersama-sama mendukung perkembangan
                    pendidikan yang lebih baik dan meraih prestasi yang lebih
                    gemilang.
                  </Typography>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar - Guru dan Info */}
          <div className="space-y-8">
            {/* Daftar Guru */}
            <Card className="shadow-lg">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-green-700" />
                  </div>
                  <Typography
                    variant="h3"
                    className="text-xl font-bold text-gray-900">
                    Staf Pengajar
                  </Typography>
                </div>

                <div className="space-y-4">
                  {teachers.slice(0, 4).map((teacher, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <Avatar
                        src={teacher.pas_foto}
                        alt={teacher.nama_guru}
                        size="md"
                        className="border-2 border-white shadow"
                      />
                      <div>
                        <Typography
                          variant="h6"
                          className="font-bold text-gray-800">
                          {teacher.nama_guru}
                        </Typography>
                        <Typography variant="small" className="text-gray-600">
                          {teacher.keterangan_guru}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
              <Link to="/daftar-guru">
                <Button variant="text" className="flex items-center gap-2 mb-4">
                  Lihat Semua jajaran Guru
                  <ArrowLongRightIcon className="h-5 w-5" />
                </Button>
              </Link>
            </Card>
            {/* Prestasi */}
            <Card className="shadow-lg">
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <TrophyIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  <Typography
                    variant="h3"
                    className="text-xl font-bold text-gray-900">
                    Prestasi Terbaru
                  </Typography>
                </div>

                <div className="space-y-3">
                  {posts
                    .filter((post) => post.kategori === "prestasi")
                    .slice(0, 3)
                    .map((post, index) => (
                      <div key={index} className="p-3 bg-amber-50 rounded-lg">
                        <Link to={`/postingan/${post.id}`}>
                          <Typography
                            variant="small"
                            className="font-bold text-amber-800 flex items-center gap-2">
                            <TrophyIcon className="h-4 w-4" />
                            {post.title_postingan}
                          </Typography>
                        </Link>
                        <Typography variant="small" className="text-gray-600">
                          {new Date(post.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                      </div>
                    ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadSpeechPage;
