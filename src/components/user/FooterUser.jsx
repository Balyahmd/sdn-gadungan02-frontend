import React from "react";
import { Typography } from "@material-tailwind/react";
import logo from "../../assets/logo_sdn_gadungan02.png";
import { MapPinIcon, EnvelopeIcon, ClockIcon } from "@heroicons/react/24/solid";

export default function FooterUser() {
  const footerLinks = [
    {
      title: "Tautan Cepat",
      links: [
        { name: "Beranda", href: "/" },
        { name: "Profil Sekolah", href: "/sambutan-kepala-sekolah" },
        { name: "Visi & Misi", href: "/visi-misi" },
        { name: "Berita Terkini", href: "/postingan" },
        { name: "Sejarah Sekolah", href: "/sejarah-sekolah" },
      ],
    },
  ];

  return (
    <footer className="relative z-50 bg-green-700 text-white py-8">
      {/* Overlay untuk memastikan background tidak terlihat */}
      <div className="absolute inset-0 bg-darkGreenColor2 -z-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {/* Logo Sekolah */}
          <div className="col-span-1">
            <div className="flex flex-col items-center text-center">
              <Typography variant="h5" className="mb-4">
                <span className="block text-white">UPT SDN GADUNGAN 2</span>
              </Typography>
              <img src={logo} alt="logo" className="w-30 h-40 py-1.5 mx-auto" />
              <Typography className="text-gray-300">
                Mencetak generasi cerdas, berkarakter, dan berbudaya.
              </Typography>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="col-span-1">
              <Typography variant="h6" className="mb-4 text-whiteColor">
                {section.title}
              </Typography>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kontak */}
          <div className="col-span-1">
            <Typography variant="h6" className="mb-4 text-whiteColor">
              Kontak Kami
            </Typography>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  Dsn. Sukomulyo RT.04 RW.01, Gadungan, Kec. Gandusari, Kab.
                  Blitar, Jawa Timur.
                </span>
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                <span className="text-gray-300">sdgadungan2@gmail.com</span>
              </li>
              <li className="flex items-start">
                <ClockIcon className="h-5 w-5 mr-2" />
                <div className="flex flex-col">
                  <span className="text-gray-300">
                    Senin-Kamis: 07.00-13.00 WIB
                  </span>
                  <span className="text-gray-300">Jumat: 7.00-10.30 WIB</span>
                  <span className="text-gray-300">Sabtu: 7.00-12.00 WIB</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-lightGreenColor mt-8 pt-6 text-center text-whiteColor">
          <Typography variant="small">
            © {new Date().getFullYear()} SDN GADUNGAN 2. All rights reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
}
