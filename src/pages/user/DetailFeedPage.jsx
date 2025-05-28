import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Chip,
} from "@material-tailwind/react";
import {
  CalendarDaysIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";
import PostService from "../../services/postService";

const DetailFeedPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.getPostById(id);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Typography variant="h4">Postingan tidak ditemukan</Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/postingan">
          <Button variant="text" className="flex items-center gap-2 mb-6 px-0">
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali ke Beranda
          </Button>
        </Link>

        {/* Card Utama */}
        <Card className="shadow-lg overflow-hidden">
          {/* Thumbnail */}
          <div className="h-64 w-full relative overflow-hidden">
            <img
              src={post.thumbnail_postingan}
              alt={post.title_postingan}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/default-thumbnail.jpg";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-6">
              <Chip
                value={post.kategori}
                color={
                  post.kategori === "Pengumuman"
                    ? "blue"
                    : post.kategori === "Prestasi"
                    ? "green"
                    : "amber"
                }
                className="rounded-full font-medium"
              />
              <Typography
                variant="h1"
                className="mt-2 text-white text-2xl sm:text-3xl font-bold">
                {post.title_postingan}
              </Typography>
            </div>
          </div>

          <CardBody className="p-6 sm:p-8">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                <Typography variant="small" className="text-gray-600">
                  {new Date(post.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <UserCircleIcon className="h-5 w-5 text-gray-500" />
                <Typography variant="small" className="text-gray-600">
                  Admin
                </Typography>
              </div>
            </div>

            {/* Konten */}
            <div className="prose max-w-none">
              <Typography
                variant="paragraph"
                className="mb-4 text-gray-700 leading-relaxed">
                {post.deskripsi_postingan}
              </Typography>
              <div dangerouslySetInnerHTML={{ __html: post.text_postingan }} />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
              <Button variant="outlined" className="flex items-center gap-2">
                <ShareIcon className="h-5 w-5" />
                Bagikan
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Related Posts */}
        <div className="mt-12">
          <Typography variant="h3" className="text-xl font-bold mb-6">
            Postingan Terkait
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <Card
                key={item}
                className="shadow-md hover:shadow-lg transition-shadow">
                <CardBody className="p-4">
                  <Typography
                    variant="h5"
                    className="text-lg font-semibold mb-2">
                    Contoh Postingan Terkait {item}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 mb-3">
                    Deskripsi singkat tentang postingan terkait yang mungkin
                    menarik...
                  </Typography>
                  <Link to=":id">
                    <Button variant="text" size="sm" className="p-0">
                      Baca Selengkapnya
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFeedPage;
