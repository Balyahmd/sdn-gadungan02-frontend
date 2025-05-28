import React, { useState, useEffect } from "react";
import { Pannellum } from "pannellum-react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import "../../App.css";

const panoramaData = [
  {
    id: 6,
    nama_ruangan: "Ruangan Kita",
    gambar_panorama:
      "https://ik.imagekit.io/sd9x6zvw3/virtual-tour/gambar_panorama-1748153410903_AcZeVE2Jq.jpeg",
    hotspots: [
      {
        id: 7,
        pitch: -0.371762,
        yaw: 41.725276,
        text: "Hotspot 2",
        title: "Hotspot 2",
        description: "Deskripsi di sini",
        targetPanoramaId: null,
        type: "info",
        targetPanorama: null,
      },
      {
        id: 10,
        pitch: -2.453691,
        yaw: 162.064964,
        text: "Hotspot 2",
        title: "Hotspot 2",
        description: "Deskripsi di sini",
        targetPanoramaId: null,
        type: "info",
        targetPanorama: null,
      },
    ],
  },
  {
    id: 7,
    nama_ruangan: "Ruangan Perpustakaan",
    gambar_panorama:
      "https://ik.imagekit.io/sd9x6zvw3/virtual-tour/gambar_panorama-1748153871590_xLmnKq6gK.jpg",
    hotspots: [
      {
        id: 12,
        pitch: 3.88759,
        yaw: 171.373911,
        text: "Hotspot 2",
        title: "Hotspot 2",
        description: "Deskripsi di sinia",
        targetPanoramaId: 6,
        type: "scene",
        targetPanorama: {
          id: 6,
          nama_ruangan: "Ruangan Kita",
          gambar_panorama:
            "https://ik.imagekit.io/sd9x6zvw3/virtual-tour/gambar_panorama-1748153410903_AcZeVE2Jq.jpeg",
        },
      },
      {
        id: 11,
        pitch: 0.902958,
        yaw: -114.617091,
        text: "satu nusa",
        title: "satu nusa",
        description: "dasdadasdasdasdasd",
        targetPanoramaId: 6,
        type: "scene",
        targetPanorama: {
          id: 6,
          nama_ruangan: "Ruangan Kita",
          gambar_panorama:
            "https://ik.imagekit.io/sd9x6zvw3/virtual-tour/gambar_panorama-1748153410903_AcZeVE2Jq.jpeg",
        },
      },
    ],
  },
  {
    id: 8,
    nama_ruangan: "asdadad",
    gambar_panorama:
      "https://ik.imagekit.io/sd9x6zvw3/virtual-tour/gambar_panorama-1748235234820_xelgCSpN-.jpg",
    hotspots: [
      {
        id: 13,
        pitch: 7.013597,
        yaw: -66.943381,
        text: "Jalan Keluar",
        title: "Jalan Keluar",
        description: "Deskripsi di sinidasdasdasdasd",
        targetPanoramaId: 7,
        type: "scene",
        targetPanorama: {
          id: 7,
          nama_ruangan: "Ruangan Perpustakaan",
          gambar_panorama:
            "https://ik.imagekit.io/sd9x6zvw3/virtual-tour/gambar_panorama-1748153871590_xLmnKq6gK.jpg",
        },
      },
    ],
  },
];

const VirtualTourPage = () => {
  const [currentPanoramaId, setCurrentPanoramaId] = useState(null);
  const [currentSpot, setCurrentSpot] = useState(null);

  useEffect(() => {
    if (panoramaData.length > 0 && currentPanoramaId === null) {
      setCurrentPanoramaId(panoramaData[0].id);
    }
  }, [currentPanoramaId]);

  useEffect(() => {
    const spot = panoramaData.find((p) => p.id === currentPanoramaId);
    setCurrentSpot(spot || null);
  }, [currentPanoramaId]);

  const handleHotspotClick = (evt, args) => {
    if (args.type === "scene" && args.targetPanoramaId) {
      setCurrentPanoramaId(args.targetPanoramaId);
    } else if (args.type === "info") {
      alert(`${args.title}\n${args.description}`);
    }
  };

  if (!currentSpot) return <div>Loading virtual tour...</div>;

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-3">
        <div className="mb-6 text-center">
          <h1 className="font-bold text-2xl md:text-3xl text-gray-600">
            Virtual Tour 360 - {currentSpot.nama_ruangan}
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
                  image={currentSpot.gambar_panorama}
                  pitch={0}
                  yaw={0}
                  hfov={110}
                  autoLoad
                  showZoomCtrl
                  showFullscreenCtrl>
                  {currentSpot.hotspots.map((hotspot) => (
                    <Pannellum.Hotspot
                      key={hotspot.id}
                      type="custom"
                      pitch={hotspot.pitch}
                      yaw={hotspot.yaw}
                      handleClick={handleHotspotClick}
                      handleClickArg={{
                        type: hotspot.type,
                        targetPanoramaId: hotspot.targetPanoramaId,
                        title: hotspot.title,
                        description: hotspot.description,
                      }}
                    />
                  ))}
                </Pannellum>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {panoramaData.map((spot) => (
            <Card
              key={spot.id}
              className={`cursor-pointer transition-all transform ${
                currentPanoramaId === spot.id
                  ? "ring-4 ring-blue-500 scale-110 shadow-xl"
                  : "hover:shadow-lg hover:scale-105"
              }`}
              onClick={() => setCurrentPanoramaId(spot.id)}>
              <CardBody className="p-3 flex flex-col items-center">
                <div className="w-full h-24 mb-2 rounded-md overflow-hidden bg-gray-200">
                  <img
                    src={spot.gambar_panorama}
                    alt={spot.nama_ruangan}
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
                  {spot.nama_ruangan}
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
