import React, { useState, useEffect } from "react";
import { Typography, Input } from "@material-tailwind/react";
import TeacherCard from "../../components/user/TeacherCard";
import TeacherService from "../../services/teacherService";
import { UserGroupIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fungsi fetch data guru dari API/service
  const fetchTeachers = async (keyword = "") => {
    try {
      setLoading(true);
      const response = await TeacherService.getTeachers(keyword);
      // Sesuaikan jika API response berbeda
      setTeachers(response.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect dengan debounce sederhana untuk searchTerm
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTeachers(searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="container mx-auto py-10 px-4 min-h-[calc(100vh-300px)]">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4">
          <UserGroupIcon className="h-8 w-8 text-green-700" />
        </div>
        <Typography
          variant="h2"
          className=" text-2xl md:text-4xl text-center font-bold mb-2 text-gray-800">
          Guru dan Staf SDN Gadungan 02
        </Typography>
        <Typography variant="lead" className="text-green-700">
          Lihat profil lengkap guru dan staf yang berperan penting dalam
          mendukung
        </Typography>
        <Typography variant="lead" className="text-green-700 pb-4">
          kegiatan belajar mengajar di SDN Gadungan 02.
        </Typography>

        {/* Input Search */}
        <div className="max-w-4xl mx-auto mb-8">
          <Input
            label="Cari guru..."
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <Typography className="text-center text-gray-500">
          Memuat data guru...
        </Typography>
      ) : teachers.length === 0 ? (
        <Typography className="text-center text-gray-500">
          Guru tidak ditemukan.
        </Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.nip || teacher.id} {...teacher} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
