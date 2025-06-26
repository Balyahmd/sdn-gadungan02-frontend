import React, { useState, useEffect } from "react";
import { Link } from "react-router";

import { Typography, IconButton } from "@material-tailwind/react";

import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import jumbo1 from "../../assets/upacara.jpeg";
import jumbo2 from "../../assets/Guru.jpeg";
import jumbo3 from "../../assets/Pramuka.jpeg";

const JumbotronUser = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: jumbo1,
      title: "Selamat Datang di UPT SDN Gadungan 02",
      subtitle:
        "Sekolah Unggul mewujudkan murid yang berakhlak mulia, unggul, dan mampu menjawab tantangan zaman",
    },
    {
      image: jumbo2,
      title: "Pendidikan Berkualitas",
      subtitle:
        "Menyiapkan Generasi Unggul yang Siap Menghadapi Tantangan dan Meraih Kesuksesan di Masa Depan",
    },
    {
      image: jumbo3,
      title: "Fasilitas Modern",
      subtitle:
        "Lingkungan Belajar yang Nyaman, mendukung proses pembelajaran yang efektif, kreatif, dan menyenangkan bagi seluruh siswa.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-[530px] overflow-hidden bg-inherit">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
        }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full h-full flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              flex: `0 0 ${100 / slides.length}%`,
            }}>
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="container mx-auto px-4 z-10 text-center">
              <Typography
                variant="h1"
                className="text-white mb-2 text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {slide.title}
              </Typography>
              <Typography
                variant="lead"
                className="text-gray-300 mb-8 block lg:hidden">
                {slide.subtitle}
              </Typography>
              <Typography
                variant="lead"
                className="text-gray-300 mb-8 hidden lg:block">
                {slide.subtitle
                  .split(" ")
                  .slice(0, Math.ceil(slide.subtitle.split(" ").length / 2))
                  .join(" ")}
                <br />
                {slide.subtitle
                  .split(" ")
                  .slice(Math.ceil(slide.subtitle.split(" ").length / 2))
                  .join(" ")}
              </Typography>
              <div className="flex gap-4 justify-center">
                <Link to="/sambutan-kepala-sekolah">
                  <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-8 rounded-xl">
                    Profil Sekolah
                  </button>
                </Link>

                <button
                  onClick={() =>
                    window.open(
                      "https://linktr.ee/sdngadungan02_Blitar",
                      "_blank"
                    )
                  }
                  className="bg-transparent hover:bg-white text-white hover:text-green-800 font-bold py-2 px-8 border border-white rounded-xl">
                  Kontak Kami
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-1 rounded-full transition-all ${
              currentSlide === index ? "bg-white w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default JumbotronUser;
