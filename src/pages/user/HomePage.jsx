import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
} from "@material-tailwind/react";

import {
  ChevronDoubleRightIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  FlagIcon,
  ArrowLongRightIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";

import JumbotronUser from "../../components/user/JumbotronUser";
import ContactUser from "../../components/user/ContactUser";
import PostService from "../../services/postService";
import VisiMisiService from "../../services/visiMisiService";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [state, setState] = useState({
    posts: [],
    loading: false,
    searchTerm: "",
  });

  const [visiMisi, setVisiMisi] = useState(null); // default null

  const setStateValue = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const { posts, searchTerm } = state;

  useEffect(() => {
    const fetchVisiMisi = async () => {
      try {
        const response = await VisiMisiService.getVisiMisi();
        console.log("response", response);
        if (response.data) {
          setVisiMisi(response.data);
        }
      } catch (error) {
        console.error("Gagal memuat Visi Misi:", error);
      }
    };
    fetchVisiMisi();
  }, []);

  const getVisiMisiData = () => [
    {
      category: "Visi",
      icon: <StarIcon className="h-6 w-6 text-white" />,
      value: visiMisi?.text_visi || "Visi belum tersedia",
    },
    {
      category: "Misi",
      icon: <ClipboardDocumentCheckIcon className="h-6 w-6 text-white" />,
      value:
        Array.isArray(visiMisi?.text_misi) && visiMisi.text_misi.length > 1
          ? visiMisi.text_misi[1]
          : "Misi belum tersedia",
    },
    {
      category: "Tujuan",
      icon: <FlagIcon className="h-6 w-6 text-white" />,
      value:
        Array.isArray(visiMisi?.text_tujuan) && visiMisi.text_tujuan.length > 1
          ? visiMisi.text_tujuan[1]
          : "Tujuan belum tersedia",
    },
  ];

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
      fetchPosts(searchTerm);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="relative min-h-[calc(100vh-300px)]">
      <div className="relative z-10">
        <div className="bg-gray-50">
          <JumbotronUser />
        </div>
        {/* VISI MISI */}
        <div className="py-12 bg-gray-100">
          <div className="container mx-auto px-4 md:px-20 lg:px-40">
            <Typography variant="h3" className="text-center mb-8 lg:mb-12">
              Visi Misi & Tujuan Sekolah
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getVisiMisiData().map((item, index) => (
                <div
                  key={index}
                  className="relative group flex flex-col items-center h-full">
                  <div className="absolute -top-5 z-10">
                    <div className="bg-green-600 rounded-full p-4 shadow-md flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
                      {item.icon}
                    </div>
                  </div>
                  <Link to="/visi-misi">
                    <Card className="w-full min-h-[250px] py-8 px-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:bg-green-100 duration-300 bg-white">
                      <CardBody className="flex flex-col items-center text-center space-y-2">
                        <h4 className="font-semibold text-green-700 tracking-wide">
                          {item.category}
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {item.value}
                        </p>
                      </CardBody>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* POSTINGAN */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Typography variant="h3" className="text-center mb-12">
              Berita & Info Terbaru
            </Typography>
            <div className="flex justify-end mb-8">
              <Link to="/postingan">
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-blackColor hover:text-green-700">
                  Lihat Semua Postingan
                  <ChevronDoubleRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
              {posts.slice(0, 4).map((post) => (
                <Card
                  key={post.id}
                  className="hover:shadow-lg transition-shadow h-full">
                  <CardHeader color="blue-gray" className="relative h-48">
                    <img
                      src={post.thumbnail_postingan}
                      alt={post.title_postingan}
                      className="h-full w-full object-cover"
                    />
                  </CardHeader>
                  <CardBody className="flex-grow">
                    <Typography variant="h5" className="mb-2">
                      {post.title_postingan || "Postingan Kosong"}
                    </Typography>
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <Typography variant="ll" color="gray">
                        {new Date(post.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Typography>
                    </div>
                    <Typography>{post.deskripsi_postingan}</Typography>
                  </CardBody>
                  <CardFooter className="mt-auto">
                    <Link to={`/postingan/${post.id}`}>
                      <Button
                        variant="text"
                        className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white">
                        Baca Selengkapnya
                        <ArrowLongRightIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <ContactUser />
      </div>
    </div>
  );
}
