import React from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import logo from "../../assets/logo_sdn_gadungan02.png";

const VisiMisiPage = () => {
  const data = {
    visi: "Mewujudkan murid yang berakhlak mulia, unggul, dan mampu menjawab tantangan zaman",
    misi: [
      "Membangun lingkungan belajar yang memfasilitasi kegiatan yang mengembangkan keimanan dan ketakwaan kepada Tuhan Yang Maha Esa.",
      "Mewujudkan disiplin positif dalam menciptakan suasana belajar di sekolah yang aman dan nyaman.",
      "Menjunjung tinggi nilai-nilai kebangsaan dalam setiap aspek pendidikan untuk membangun generasi yang berkarakter.",
      "Meningkatkan kompetensi guru dan tenaga kependidikan melalui pelatihan teknologi digital secara berkelanjutan.",
      "Membangun sistem manajemen yang inklusif dan akses informasi yang transparan melalui platform digital.",
    ],
    tujuan: [
      "Membekali siswa dengan menguasai teknologi sebagai bekal menghadapi tantangan di era digital.",
      "Meningkatkan efektivitas pembelajaran berbasis parameter teknologi informasi, seperti e-learning dan virtual test.",
      "Menyediakan pendidikan yang transparan dan mudah diakses oleh siswa, guru, orang tua, dan masyarakat umum.",
      "Menyelenggarakan program-program pendidikan yang selaras dengan perkembangan zaman dan kebutuhan industri.",
      "Menumbuhkan sikap kebersamaan dan toleransi melalui kegiatan yang mendukung persatuan dalam kebinekaan.",
    ],
  };
  return (
    <div className="min-h-[calc(100vh-200px)] py-8 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardBody className="p-6 md:p-8">
            <Typography
              variant="h2"
              className="text-3xl md:text-4xl font-bold text-center mb-8 text-green-700">
              Visi Misi & Tujuan
            </Typography>

            <div className="flex items-center justify-center">
              <img src={logo} alt="Logo" className="h-[250px] w-[350px]" />
            </div>

            {/* Visi Section */}
            <div className="mb-5">
              <Typography
                variant="h3"
                className="text-2xl font-bold mb-4 text-green-700">
                Visi
              </Typography>
              <Typography className="text-gray-700 font-normal text-lg">
                {data.visi}
              </Typography>
            </div>

            {/* Misi Section */}
            <div className="mb-10">
              <Typography
                variant="h3"
                className="text-2xl font-bold mb-4 text-green-700">
                Misi
              </Typography>
              <ol className="list-decimal pl-6 space-y-2">
                {data.misi.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            {/* Tujuan Section */}
            <div>
              <Typography
                variant="h3"
                className="text-2xl font-bold mb-4 text-green-700">
                Tujuan
              </Typography>
              <ol className="list-decimal pl-6 space-y-3">
                {data.tujuan.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default VisiMisiPage;
