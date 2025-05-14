import React, { useState } from "react";
import { Pannellum } from "pannellum-react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import virtour1 from "../../assets/Halaman-utama-SDNGadungan02.jpg";
import virtour2 from "../../assets/Kelas 3.jpeg";

const VirtualTourPage = () => {
  const [currentScene, setCurrentScene] = useState(0);

  const tourSpots = [
    {
      id: 1,
      name: "Halaman Utama Sekolah",
      image: virtour1,
      config: {
        yaw: 180,
        pitch: 10,
        hfov: 110,
      },
    },
    {
      id: 2,
      name: "Ruang Kelas 3",
      image: virtour2,
      config: {
        yaw: 120,
        pitch: 5,
        hfov: 100,
      },
    },
    {
      id: 3,
      name: "Perpustakaan",
      image: "https://pannellum.org/images/cerro-toco-0.jpg",
      config: {
        yaw: 200,
        pitch: 0,
        hfov: 120,
      },
    },
  ];

  const handleThumbnailClick = (index) => {
    setCurrentScene(index);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-3">
        <div className="mb-6 text-center">
          <h1 className="font-bold text-2xl md:text-3xl text--600">
            Virtual Tour 360
          </h1>
          <p className="text-gray-600 mt-2">
            Nikmati perjalanan virtual dengan pengalaman 360 derajat.
          </p>
        </div>

        {/* Panorama Viewer */}
        <div className="mb-8">
          <Card className="shadow-2xl border border-blue-100">
            <CardBody className="p-0">
              <div className="w-full h-[500px] rounded-lg overflow-hidden">
                <Pannellum
                  width="100%"
                  height="500px"
                  image={tourSpots[currentScene].image}
                  pitch={tourSpots[currentScene].config.pitch}
                  yaw={tourSpots[currentScene].config.yaw}
                  hfov={tourSpots[currentScene].config.hfov}
                  autoLoad
                  showZoomCtrl
                  showFullscreenCtrl
                  onLoad={() => {
                    console.log("Panorama loaded");
                  }}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tourSpots.map((spot, index) => (
            <Card
              key={spot.id}
              className={`cursor-pointer transition-all transform ${
                currentScene === index
                  ? "ring-4 ring-blue-500 scale-110 shadow-xl"
                  : "hover:shadow-lg hover:scale-105"
              }`}
              onClick={() => handleThumbnailClick(index)}>
              <CardBody className="p-3 flex flex-col items-center">
                <div className="w-full h-24 mb-2 rounded-md overflow-hidden bg-gray-200">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                      e.target.alt = "Gambar tidak tersedia";
                    }}
                  />
                </div>
                <Typography
                  variant="small"
                  className="text-center font-semibold text-gray-700">
                  {spot.name}
                </Typography>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualTourPage;
