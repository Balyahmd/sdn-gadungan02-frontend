import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import {
  CalendarDaysIcon,
  UserCircleIcon,
  ArrowLeftIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from "react-share";

import thumnailMain from "../../assets/Thumnail_post.png";

import { Link, useParams } from "react-router-dom";
import PostService from "../../services/postService";

const DetailFeedPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [openShareModal, setOpenShareModal] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await PostService.getPostById(id);
        const postData = response.data;
        setPost(postData);

        // Fetch all posts, then filter
        const allPosts = await PostService.getPosts(); // pastikan fungsi ini ada
        const related = allPosts.data.filter(
          (item) =>
            item.kategori === postData.kategori && item.id !== postData.id
        );
        setRelatedPosts(related);
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

  const shareUrl = window.location.href;
  const shareTitle = post.title_postingan;
  const shareDesc = post.deskripsi_postingan;

  return (
    <div className="min-h-[calc(100vh-300px)] bg-gray-50 py-8 mb-4 px-4 sm:px-6 lg:px-8">
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
              src={thumnailMain}
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
                  post.kategori === "pengumuman"
                    ? "blue"
                    : post.kategori === "prestasi"
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
                  {post.author_username}
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

              <img
                src={post.thumbnail_postingan || "/default-thumbnail.jpg"}
                alt={post.title_postingan}
                className="object-cover duration-300 mb-3 max-w-md max-h-xl mx-auto"
                onError={(e) => {
                  e.target.src = "/default-thumbnail.jpg";
                }}
              />
              <div dangerouslySetInnerHTML={{ __html: post.text_postingan }} />
            </div>

            {/* Keywords */}
            {post.keyword && (
              <div className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {post.keyword.split(",").map((keyword, index) => (
                    <Chip
                      key={index}
                      value={keyword.trim()}
                      className={`font-medium rounded-full ${
                        post.kategori === "pengumuman"
                          ? "bg-blue-600"
                          : post.kategori === "prestasi"
                          ? "bg-green-600"
                          : "bg-amber-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
              <Button
                variant="outlined"
                className="flex items-center gap-2"
                onClick={() => setOpenShareModal(true)}>
                <ShareIcon className="h-5 w-5" />
                Bagikan
              </Button>
            </div>

            <Dialog
              open={openShareModal}
              handler={() => setOpenShareModal(!openShareModal)}
              size="sm">
              <DialogHeader>Bagikan Postingan</DialogHeader>
              <DialogBody divider>
                {/* Preview share */}
                <div className="flex gap-4 mb-6">
                  <img
                    src={post.thumbnail_postingan}
                    alt={post.title_postingan}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = "/default-thumbnail.jpg";
                    }}
                  />
                  <div className="flex flex-col justify-between">
                    <Typography variant="h6" className="font-semibold">
                      {shareTitle}
                    </Typography>
                    <Typography
                      variant="small"
                      className="text-gray-700 line-clamp-3">
                      {shareDesc}
                    </Typography>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="flex justify-center gap-8">
                  <FacebookShareButton
                    url={shareUrl}
                    quote={shareTitle}
                    className="hover:opacity-80 transition-opacity flex justify-center">
                    <FacebookIcon size={56} round />
                  </FacebookShareButton>

                  <WhatsappShareButton
                    url={shareUrl}
                    title={shareTitle}
                    className="hover:opacity-80 transition-opacity flex justify-center">
                    <WhatsappIcon size={56} round />
                  </WhatsappShareButton>
                </div>
              </DialogBody>
              <DialogFooter>
                <Button variant="text" onClick={() => setOpenShareModal(false)}>
                  Tutup
                </Button>
              </DialogFooter>
            </Dialog>
          </CardBody>
        </Card>

        {/* Related Posts */}
        <div className="mt-12">
          <Typography variant="h3" className="text-xl font-bold mb-6">
            Berita & Info Terkait
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.slice(0, 2).map((item) => (
              <Card
                key={item.id}
                className="shadow-md hover:shadow-lg transition-shadow">
                <CardBody className="p-4">
                  <Typography
                    variant="h5"
                    className="text-lg font-semibold mb-2">
                    {item.title_postingan}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 mb-3">
                    {item.deskripsi_postingan.slice(0, 100)}...
                  </Typography>
                  <Link to={`/postingan/${item.id}`}>
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
