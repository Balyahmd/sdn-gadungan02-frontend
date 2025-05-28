import { Button, Typography, Card } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card
        className="w-full max-w-md text-center p-8 shadow-lg"
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}>
        <Typography
          variant="h1"
          color=""
          className="mb-4"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}>
          404
        </Typography>
        <Typography
          variant="h5"
          className="mb-2"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}>
          Halaman Tidak Ditemukan
        </Typography>
        <Typography
          color="gray"
          className="mb-6 font-normal"
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}>
          Maaf, halaman yang kamu cari tidak ditemukan atau telah dipindahkan.
        </Typography>
        <Button
          color="green"
          onClick={() => navigate("/")}
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}>
          Kembali ke Beranda
        </Button>
      </Card>
    </div>
  );
}
