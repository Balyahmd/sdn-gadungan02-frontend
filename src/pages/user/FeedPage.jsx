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
import { Link } from "react-router-dom";
import PostService from "../../services/postService";
import { Pagination } from "../../components/Pagination";

const FeedPage = () => {
  const [state, setState] = useState({
    posts: [],
    loading: true,
    searchTerm: "",
    selectedCategory: "Semua",
    currentPage: 1,
    postsPerPage: 6,
  });

  const {
    posts,
    loading,
    searchTerm,
    selectedCategory,
    currentPage,
    postsPerPage,
  } = state;

  const setStateValue = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const categories = ["Semua", "Prestasi", "Kegiatan", "Pengumuman"];

  const fetchPosts = async () => {
    try {
      setStateValue("loading", true);
      const response = await PostService.getPosts(searchTerm);
      setStateValue("posts", response.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setStateValue("loading", false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Filter kategori
  const filteredPosts = posts.filter(
    (post) => selectedCategory === "Semua" || post.kategori === selectedCategory
  );

  const handlePageChange = (pageNumber) => {
    setStateValue("currentPage", pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Typography
            variant="h1"
            className="text-3xl font-bold text-gray-900 mb-2">
            Semua Postingan
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
              onChange={(e) => setStateValue("searchTerm", e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Kategori"
              value={selectedCategory}
              onChange={(val) => setStateValue("selectedCategory", val)}>
              {categories.map((cat, index) => (
                <Option key={index} value={cat}>
                  {cat}
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
          ) : filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Typography variant="h6" className="text-gray-600">
                Tidak ada postingan yang ditemukan
              </Typography>
            </div>
          ) : (
            filteredPosts.map((post) => (
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
                        post.kategori === "Pengumuman"
                          ? "blue"
                          : post.kategori === "Prestasi"
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
                    <Link to={`/posts/${post.id}`}>
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

        {!loading && filteredPosts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredPosts.length / postsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
