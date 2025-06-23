import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardBody,
  Chip,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { NewspaperIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import PostService from "../../services/postService";
import { Pagination } from "../../components/Pagination";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const categories = ["Semua", "prestasi", "kegiatan", "pengumuman"];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await PostService.getPosts(); // Ambil semua postingan
        setPosts(response.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Reset ke halaman 1 saat search atau kategori berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Filter berdasarkan kategori & search term
  const filteredPosts = posts.filter((post) => {
    const matchCategory =
      selectedCategory === "Semua" || post.kategori === selectedCategory;
    const matchSearch = post.title_postingan
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="min-h-[calc(100vh-300px)] bg-gray-50 py-8 px-4 mb-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4">
            <NewspaperIcon className="h-8 w-8 text-green-700" />
          </div>
          <Typography
            variant="h1"
            className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Berita & Info Sekolah
          </Typography>
          <Typography variant="lead" className="text-gray-600">
            Informasi terbaru seputar SDN Gadungan 02
          </Typography>
        </div>

        {/* Filter dan Pencarian */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Cari postingan..."
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Kategori"
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}>
              {categories.map((cat, index) => (
                <Option key={index} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Daftar Postingan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Typography variant="h6" className="text-gray-600">
                Tidak ada postingan yang ditemukan
              </Typography>
            </div>
          ) : (
            currentPosts.map((post) => (
              <Card
                key={post.id}
                className="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.thumbnail_postingan || "/default-thumbnail.jpg"}
                    alt={post.title_postingan}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/default-thumbnail.jpg";
                    }}
                  />
                </div>
                <CardBody className="flex flex-col flex-grow">
                  <div className="mb-3">
                    <Chip
                      value={post.kategori}
                      color={
                        post.kategori.toLowerCase() === "pengumuman"
                          ? "blue"
                          : post.kategori.toLowerCase() === "prestasi"
                          ? "green"
                          : "amber"
                      }
                    />
                  </div>
                  <Typography
                    variant="h5"
                    className="mb-2 text-lg font-bold line-clamp-2">
                    {post.title_postingan}
                  </Typography>

                  <Typography
                    variant="paragraph"
                    className="mb-4 text-gray-600 text-sm line-clamp-3">
                    {post.deskripsi_postingan}
                  </Typography>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <Typography variant="small" className="text-gray-600">
                        {new Date(post.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Typography>
                    </div>
                    <Link to={`/postingan/${post.id}`}>
                      <Button
                        variant="text"
                        size="sm"
                        className="p-0 text-blue-600 hover:text-blue-700">
                        Baca Selengkapnya
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredPosts.length > postsPerPage && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredPosts.length / postsPerPage)}
              onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
