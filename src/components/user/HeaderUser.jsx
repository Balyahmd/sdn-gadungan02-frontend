import React, { useState, useEffect } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Input,
  Button,
} from "@material-tailwind/react";
import {
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  HomeIcon,
  StarIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  BellAlertIcon,
  UserGroupIcon,
  ChevronDownIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import logo from "../../assets/logo_sdn_gadungan02.png";
import { Link } from "react-router-dom";

export default function Header() {
  const [openNav, setOpenNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileProfil, setOpenMobileProfil] = useState(false);
  const [profilDropdown, setProfilDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      name: "Beranda",
      href: "/",
      icon: <HomeIcon className="h-5 w-5 mr-2" />,
    },
    {
      name: "Virtual Tour 360",
      href: "/virtual-tour",
      icon: <GlobeAltIcon className="h-5 w-5 mr-2" />,
    },

    {
      name: "Berita & Info Sekolah",
      href: "/postingan",
      icon: <BellAlertIcon className="h-5 w-5 mr-2" />,
    },
  ];

  const navItemsDropdown = [
    {
      name: "Guru & Staff",
      href: "/daftar-guru",
      icon: <UserGroupIcon className="h-5 w-5 mr-2" />,
    },
    {
      name: "Visi dan Misi",
      href: "/visi-misi",
      icon: <StarIcon className="h-5 w-5 mr-2" />,
    },
    {
      name: "Sejarah",
      href: "/sejarah-sekolah",
      icon: <BookOpenIcon className="h-5 w-5 mr-2" />,
    },
  ];

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* Top Header */}
      <div
        className={`bg-green-700 text-white overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isScrolled ? "max-h-0" : "max-h-[200px] py-1.5"
        }`}>
        <div className="container mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2">
          <div className="w-full sm:w-auto flex justify-center sm:justify-start items-center">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span className="text-sm text-center sm:text-left">
              Sukomulyo 04/01, Gadungan, Gandusari, Blitar, Jawa Timur.
            </span>
          </div>
          <div className="hidden md:flex items-center">
            <EnvelopeIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">sdngadungan02@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Main Header - Full Width */}
      <Navbar className=" bg-whiteColor w-full max-w-full rounded-none px-4 py-3 shadow-none border-b">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-15" />
            <Typography variant="h5" className="cursor-pointer">
              <span className="block text-gray-900 text-medium font-bold">
                SDN GADUNGAN 02
              </span>
            </Typography>
          </div>

          {/* Desktop Nav + Search */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-3">
              {navItems.map((item) => (
                <Typography
                  as="li"
                  key={item.name}
                  variant="paragraph"
                  className="font-medium">
                  <Link
                    to={item.href}
                    className="flex items-center py-2 px-3 text-blackColor text-lg transition-colors duration-300 hover:text-green-700">
                    {item.icon}
                    {item.name}
                  </Link>
                </Typography>
              ))}
              <Typography
                as="li"
                variant="paragraph"
                className="relative font-medium"
                onMouseEnter={() => setProfilDropdown(true)}
                onMouseLeave={() => setProfilDropdown(false)}>
                <Link to="/sambutan-kepala-sekolah">
                  <button
                    variant="button"
                    className="flex items-center py-2 px-3 text-blackColor text-lg transition-colors duration-300 hover:text-green-700 cursor-pointer">
                    <AcademicCapIcon className="h-5 w-5 mr-2" />
                    Profil Sekolah
                    <ChevronDownIcon className="h-5 w-5 ml-2" />
                  </button>
                </Link>

                {/* Dropdown menu */}
                {profilDropdown && (
                  <ul className="absolute top-full left-0 mt-1 w-48 bg-white border rounded shadow-lg z-50">
                    {navItemsDropdown.map((item) => (
                      <li key={item.name}>
                        <Link to={item.href}>
                          <a className="flex items-center px-4 py-2 text-blackColor hover:bg-green-100 hover:text-green-700 transition-colors">
                            {item.icon}
                            {item.name}
                          </a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Typography>
            </ul>

            {/* Search Button - Desktop */}
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-4">
            <IconButton variant="text" onClick={() => setOpenNav(!openNav)}>
              {openNav ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </IconButton>
          </div>
        </div>

        {openNav && (
          <div className="lg:hidden mt-4 pb-4 space-y-3 container mx-auto">
            <Link to="/">
              <a className="p-3 text-lg text-blackColor hover:bg-gray-100 rounded-lg text-center flex items-center justify-center gap-2">
                <HomeIcon className="h-5 w-5" />
                Beranda
              </a>
            </Link>

            {/* Profil Sekolah dengan submenu toggle */}
            <div>
              <Link to="/sambutan-kepala-sekolah">
                <button
                  onClick={() => setOpenMobileProfil(!openMobileProfil)}
                  className="w-full flex justify-center items-center gap-2 p-3 text-lg text-blackColor hover:bg-gray-100 rounded-lg transition-colors">
                  <AcademicCapIcon className="h-5 w-5" />
                  Profil Sekolah
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      openMobileProfil ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </Link>
              {openMobileProfil && (
                <div className="flex justify-center mx-5">
                  <div className="flex flex-col items-center gap-2 bg-gray-200 rounded-lg w-full">
                    {navItemsDropdown.map((item) => (
                      <Link key={item.name} to={item.href}>
                        <a className="flex items-center p-2 text-blackColor hover:bg-green-100 hover:text-green-700 rounded transition-colors">
                          {item.icon}
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/virtual-tour">
              <a className="p-3 text-lg text-blackColor hover:bg-gray-100 rounded-lg text-center flex items-center justify-center gap-2">
                <GlobeAltIcon className="h-5 w-5" />
                Virtual Tour 360
              </a>
            </Link>

            <Link to="/postingan">
              <a className="p-3 text-lg text-blackColor hover:bg-gray-100 rounded-lg text-center flex items-center justify-center gap-2">
                <BellAlertIcon className="h-5 w-5" />
                Berita & Info Sekolah
              </a>
            </Link>
          </div>
        )}
      </Navbar>
    </div>
  );
}
