import React, { useState, useEffect } from "react";
import { Pannellum } from "pannellum-react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import "../../App.css";
import VirtualTourService from "../../services/virtualtourService";
import { GlobeAltIcon } from "@heroicons/react/24/solid";
import { Pagination } from "../../components/Pagination";

const VirtualTourPage = () => {
  const [currentPanoramaId, setCurrentPanoramaId] = useState(null);
  const [currentSpot, setCurrentSpot] = useState(null);
  const [panoramaData, setPanoramaData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Resize listener untuk deteksi device
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ambil data panorama dari service
  const fetchPanoramas = async () => {
    const response = await VirtualTourService.getPanoramas();
    setPanoramaData(response.data);
  };

  useEffect(() => {
    fetchPanoramas();
  }, []);

  // Atur panorama awal saat data sudah tersedia
  useEffect(() => {
    if (panoramaData.length > 0 && currentPanoramaId === null) {
      setCurrentPanoramaId(panoramaData[0].id);
    }
  }, [currentPanoramaId, panoramaData]);

  useEffect(() => {
    const spot = panoramaData.find((p) => p.id === currentPanoramaId);
    setCurrentSpot(spot);
    if (spot) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPanoramaId, panoramaData]);

  if (!currentSpot) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <svg
            className="animate-spin mx-auto mb-4 h-8 w-8 text-green-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-lg text-gray-700">Memuat virtual tour...</div>
        </div>
      </div>
    );
  }

  const panoramaUrl = isMobile
    ? `${currentSpot.gambar_panorama}?tr=w-4096`
    : currentSpot.gambar_panorama;

  // Debugging: Log currentSpot state changes

  return (
    <div className="min-h-[calc(100vh-300px)] py-8 px-4 mb-6 bg-gradient-to-r from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-3">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4">
            <GlobeAltIcon className="h-8 w-8 text-green-700" />
          </div>
          <Typography
            variant="h1"
            className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Virtual Tour 360 - {currentSpot.nama_ruangan}
          </Typography>
          <Typography variant="lead" className="text-green-700">
            Nikmati perjalanan virtual dengan pengalaman 360 derajat.
          </Typography>
        </div>

        {/* Panorama Viewer */}
        <div className="mb-8">
          <Card className="shadow-2xl border border-blue-100">
            <CardBody className="p-0">
              <div className="w-full h-[500px] rounded-lg overflow-hidden">
                <Pannellum
                  width="100%"
                  height="500px"
                  image={panoramaUrl}
                  pitch={0}
                  yaw={0}
                  hfov={120}
                  autoLoad
                  showZoomCtrl
                  showFullscreenCtrl>
                  {currentSpot.hotspots.map((hotspot) => (
                    <Pannellum.Hotspot
                      key={hotspot.id}
                      type={hotspot.kategori_hotspot}
                      text={
                        hotspot.kategori_hotspot === "info"
                          ? `${hotspot.title ?? ""}\n${
                              hotspot.description ?? ""
                            }`
                          : hotspot.title ?? ""
                      }
                      pitch={hotspot.pitch}
                      yaw={hotspot.yaw}
                      handleClick={() => {
                        console.log("Hotspot clicked:", hotspot);
                        if (
                          hotspot.kategori_hotspot === "custom" &&
                          hotspot.targetPanoramaId
                        ) {
                          setCurrentPanoramaId(hotspot.targetPanoramaId);
                        }
                      }}
                    />
                  ))}
                </Pannellum>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {panoramaData
            .sort((a, b) => a.id - b.id)
            .slice((currentPage - 1) * 5, currentPage * 5)
            .map((spot) => (
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

        <div className="mt-12 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(panoramaData.length / 5)}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </div>
      </div>
    </div>
  );
};

export default VirtualTourPage;
