import React from "react";
import {
  Typography,
  Card,
  CardBody,
  CardHeader,
} from "@material-tailwind/react";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

export default function ContactUser() {
  return (
    <div className="relative py-20 overflow-hidden min-h-[600px]">
      <div
        className="fixed inset-0 -z-10 bg-fixed bg-center bg-cover opacity-20"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-vector/hand-drawn-school-education-seamless-pattern_698782-394.jpg')",
          transform: "translate3d(0,0,0)",
        }}></div>
      {/* Konten Contact */}
      <div className="container mx-auto px-4 relative z-10">
        <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <CardHeader
            floated={false}
            shadow={false}
            className="text-center p-6 bg-green-700">
            <Typography variant="h3" className="text-white">
              Hubungi Kami
            </Typography>
          </CardHeader>

          <CardBody className="px-8 pb-6">
            {/* Kontak dalam satu baris memanjang */}
            <div className="flex flex-col md:flex-row gap-1 mb-8 overflow-hidden">
              <div className="bg-blue-gray-50/50 rounded-lg p-4 min-w-[250px] flex-2">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <MapPinIcon className="h-5 w-5 text-darkGreenColor1" />
                  </div>
                  <div>
                    <Typography
                      color="gray"
                      className="font-normal max-w-[235px]">
                      Dsn. Sukomulyo RT.04 RW.01, Gadungan, Kec. Gandusari, Kab.
                      Blitar, Jawa Timur.
                      <br />
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="bg-blue-gray-50/50 rounded-lg p-4 min-w-[250px] flex-2">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <EnvelopeIcon className="h-5 w-5 text-darkGreenColor1" />
                  </div>
                  <div>
                    <Typography color="gray" className="font-normal">
                      sdngadungan02@gmail.com
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Peta di bawah */}
            <div className="bg-gray-200 rounded-lg overflow-hidden h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.106460318399!2d112.2955334!3d-8.0132006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e788d8504a041f1%3A0xe8025dec29f0af9a!2sSDN%20Gadungan%2002!5e1!3m2!1sen!2sid!4v1745917787552!5m2!1sen!2sid"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                title="Peta Lokasi SDN Gadungan 02"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
