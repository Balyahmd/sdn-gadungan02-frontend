import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import PostService from "../../services/postService";
import imageNotFound from "../../assets/image_nonFound.png";
import { Pagination } from "../../components/Pagination";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  Tooltip,
  IconButton,
  Avatar,
  Spinner,
} from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

const ManagePostPage = () => {
  const [state, setState] = useState({
    posts: [],
    loading: true,
    searchTerm: "",
    open: false,
    isEdit: false,
    currentPost: {
      id: "",
      title_postingan: "",
      thumbnail_postingan: "",
      deskripsi_postingan: "",
      text_postingan: "",
      kategori: "",
      keyword: "",
    },
    showFullDescription: {},
    imagePreview: "",
    imageFile: null,
    isSubmitting: false,
    deleteModalOpen: false,
    postToDelete: null,
    errors: {},
    currentPage: 1,
  });

  const navigate = useNavigate();

  const {
    posts,
    loading,
    searchTerm,
    open,
    isEdit,
    currentPost,
    showFullDescription,
    imagePreview,
    imageFile,
    isSubmitting,
    deleteModalOpen,
    postToDelete,
    errors,
    currentPage,
  } = state;

  const setStateValue = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const fetchPosts = async () => {
    try {
      setStateValue("loading", true);
      const response = await PostService.getPosts(searchTerm);
      setStateValue("posts", response.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Gagal memuat postingan");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
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

  const validateForm = () => {
    const newErrors = {};
    if (!currentPost.title_postingan)
      newErrors.title_postingan = "Judul wajib diisi";
    if (!currentPost.deskripsi_postingan)
      newErrors.deskripsi_postingan = "Deskripsi wajib diisi";
    if (!currentPost.text_postingan)
      newErrors.text_postingan = "Konten wajib diisi";
    if (!currentPost.kategori) newErrors.kategori = "Kategori wajib diisi";
    if (!currentPost.keyword) newErrors.keyword = "Keyword wajib diisi";
    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setStateValue("errors", formErrors);
      return;
    }

    setStateValue("isSubmitting", true);

    try {
      const formData = new FormData();
      formData.append("title_postingan", currentPost.title_postingan);
      formData.append("deskripsi_postingan", currentPost.deskripsi_postingan);
      formData.append("text_postingan", currentPost.text_postingan);
      formData.append("kategori", currentPost.kategori);
      formData.append("keyword", currentPost.keyword);

      if (imageFile) {
        formData.append("thumbnail", imageFile);
      } else if (isEdit && currentPost.thumbnail_postingan) {
        formData.append("keepExistingImage", "true");
      }

      if (isEdit) {
        await PostService.updatePost(currentPost.id, formData);
        toast.success("Postingan berhasil diupdate");
      } else {
        await PostService.createPost(formData);
        toast.success("Postingan berhasil ditambahkan");
      }

      setStateValue("open", false);
      await fetchPosts();
      toast.success(
        `Postingan berhasil ${isEdit ? "diupdate" : "ditambahkan"}`
      );
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error(
        error.response?.data?.message ||
          `Gagal ${isEdit ? "mengupdate" : "membuat"} postingan`
      );
    } finally {
      setStateValue("isSubmitting", false);
    }
  };

  const handleDelete = async () => {
    try {
      await PostService.deletePost(postToDelete.id);
      setStateValue(
        "posts",
        posts.filter((post) => post.id !== postToDelete.id)
      );
      setStateValue("deleteModalOpen", false);
      toast.success("Postingan berhasil dihapus");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Gagal menghapus postingan");
    }
  };

  const handleOpen = () => {
    const newOpen = !open;
    setStateValue("open", newOpen);

    if (!newOpen) {
      setStateValue("isEdit", false);
      setStateValue("currentPost", {
        id: "",
        title_postingan: "",
        thumbnail_postingan: "",
        deskripsi_postingan: "",
        text_postingan: "",
        kategori: "",
        keyword: "",
      });
      setStateValue("imagePreview", "");
      setStateValue("imageFile", null);
      setStateValue("errors", {});
    }
  };

  const handleEdit = (post) => {
    setStateValue("currentPost", post);
    setStateValue("imagePreview", post.thumbnail_postingan || "");
    setStateValue("isEdit", true);
    setStateValue("open", true);
    setStateValue("errors", {});
  };

  const handleDeleteClick = (post) => {
    setStateValue("postToDelete", post);
    setStateValue("deleteModalOpen", true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStateValue("currentPost", { ...currentPost, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStateValue("imageFile", file);
      const reader = new FileReader();
      reader.onloadend = () => setStateValue("imagePreview", reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleDescription = (id) => {
    setStateValue("showFullDescription", {
      ...showFullDescription,
      [id]: !showFullDescription[id],
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h2" className="text-2xl font-bold mb-6">
        Kelola Postingan
      </Typography>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-1/2">
          <Input
            label="Cari Postingan..."
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={searchTerm}
            onChange={(e) => setStateValue("searchTerm", e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2" onClick={handleOpen}>
          <PlusIcon className="h-5 w-5" /> Tambah Postingan
        </Button>
      </div>

      <Card>
        <CardBody>
          {posts.length === 0 ? (
            <Typography className="text-center py-8">
              Tidak ada postingan ditemukan
            </Typography>
          ) : (
            <div className="overflow-x-auto">
              <ToastContainer />
              <table className="w-full min-w-max table-auto">
                <thead>
                  <tr>
                    {[
                      "No",
                      "Thumbnail",
                      "Judul",
                      "Deskripsi",
                      "Kategori",
                      "Aksi",
                    ].map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                        <Typography
                          variant="small"
                          className="font-normal leading-none opacity-70">
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts
                    .slice((currentPage - 1) * 5, currentPage * 5)
                    .map((post, index) => (
                      <tr key={post.id}>
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Avatar
                            src={post.thumbnail_postingan || imageNotFound}
                            alt={post.title_postingan}
                            size="lg"
                            variant="rounded"
                          />
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <Typography variant="small" className="font-medium">
                            {post.title_postingan}
                          </Typography>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <div className="flex items-start">
                            <Typography variant="small" className="font-normal">
                              {showFullDescription[post.id]
                                ? post.deskripsi_postingan
                                : `${post.deskripsi_postingan.substring(
                                    0,
                                    50
                                  )}...`}
                            </Typography>
                            <Tooltip
                              content={
                                showFullDescription[post.id]
                                  ? "Sembunyikan"
                                  : "Lihat Selengkapnya"
                              }>
                              <IconButton
                                variant="text"
                                size="sm"
                                onClick={() => toggleDescription(post.id)}
                                className="ml-2">
                                <InformationCircleIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
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
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <div className="flex gap-2">
                            <Tooltip content="Edit">
                              <IconButton
                                variant="text"
                                color="blue"
                                size="sm"
                                onClick={() => handleEdit(post)}>
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip content="Hapus">
                              <IconButton
                                variant="text"
                                color="red"
                                size="sm"
                                onClick={() => handleDeleteClick(post)}>
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="mt-4 mb-8 flex justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(posts.length / 5)}
                  onPageChange={(page) => setStateValue("currentPage", page)}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <Dialog open={open} handler={handleOpen} size="lg">
        <DialogHeader>
          {isEdit ? "Edit Postingan" : "Tambah Postingan Baru"}
        </DialogHeader>
        <DialogBody divider className="overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Typography variant="h6" className="mb-2">
                Thumbnail Postingan {!isEdit && "(Opsional)"}
              </Typography>
              <div className="flex flex-col items-start gap-4">
                {imagePreview && (
                  <Avatar
                    src={imagePreview}
                    alt="Preview"
                    size="xxl"
                    variant="rounded"
                    className="border border-gray-300"
                  />
                )}
                <div className="relative">
                  <Button
                    variant="outlined"
                    color="blue"
                    className="flex items-center gap-2">
                    <PhotoIcon className="h-5 w-5" />
                    {imagePreview ? "Ganti Gambar" : "Unggah Gambar"}
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {isEdit && !imageFile && (
                  <Typography variant="small" color="gray" className="italic">
                    Biarkan kosong jika tidak ingin mengubah gambar
                  </Typography>
                )}
              </div>
            </div>

            <Input
              label="Judul Postingan *"
              name="title_postingan"
              value={currentPost.title_postingan}
              onChange={handleChange}
              error={!!errors.title_postingan}
            />
            {errors.title_postingan && (
              <Typography color="red" variant="small">
                {errors.title_postingan}
              </Typography>
            )}

            <Textarea
              label="Deskripsi Singkat *"
              name="deskripsi_postingan"
              value={currentPost.deskripsi_postingan}
              onChange={handleChange}
              rows={3}
              error={!!errors.deskripsi_postingan}
            />
            {errors.deskripsi_postingan && (
              <Typography color="red" variant="small">
                {errors.deskripsi_postingan}
              </Typography>
            )}

            <Textarea
              label="Konten Lengkap *"
              name="text_postingan"
              rows={8}
              value={currentPost.text_postingan}
              onChange={handleChange}
              error={!!errors.text_postingan}
            />
            {errors.text_postingan && (
              <Typography color="red" variant="small">
                {errors.text_postingan}
              </Typography>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Kategori *"
                value={currentPost.kategori}
                onChange={(value) =>
                  setStateValue("currentPost", {
                    ...currentPost,
                    kategori: value,
                  })
                }
                error={!!errors.kategori}>
                <Option value="Pengumuman">Pengumuman</Option>
                <Option value="Prestasi">Prestasi</Option>
                <Option value="Kegiatan">Kegiatan</Option>
              </Select>
              {errors.kategori && (
                <Typography color="red" variant="small">
                  {errors.kategori}
                </Typography>
              )}

              <Input
                label="Keywords (pisahkan dengan koma) *"
                name="keyword"
                value={currentPost.keyword}
                onChange={handleChange}
                error={!!errors.keyword}
              />
              {errors.keyword && (
                <Typography color="red" variant="small">
                  {errors.keyword}
                </Typography>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
            disabled={isSubmitting}>
            <XMarkIcon className="h-5 w-5" /> Batal
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Menyimpan...
              </div>
            ) : (
              <>
                <CheckIcon className="h-5 w-5" /> {isEdit ? "Update" : "Simpan"}
              </>
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={deleteModalOpen}
        handler={() => setStateValue("deleteModalOpen", false)}>
        <DialogHeader>Konfirmasi Penghapusan</DialogHeader>
        <DialogBody>
          Apakah Anda yakin ingin menghapus postingan ini? Aksi ini tidak dapat
          dibatalkan.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setStateValue("deleteModalOpen", false)}
            className="mr-1">
            Batal
          </Button>
          <Button variant="gradient" color="red" onClick={handleDelete}>
            Hapus
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ManagePostPage;
