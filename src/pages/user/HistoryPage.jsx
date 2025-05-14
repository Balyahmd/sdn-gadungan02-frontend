import React from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";

const HistoryPage = () => {
  const historyData = [
    {
      type: "paragraph",
      content:
        "UPT SD NEGERI GADUNGAN 02 merupakan salah satu sekolah jenjang SD berstatus Negeri yang berada di wilayah Kec. Gandusari, Kab. Blitar, Jawa Timur. UPT SD NEGERI GADUNGAN 02 didirikan pada tanggal 1 Januari 1970 dengan tujuan memberikan layanan pendidikan yang berkualitas bagi masyarakat sekitar. Sekolah ini didirikan sebagai bentuk komitmen untuk mencerdaskan generasi muda yang beriman, bertakwa, dan berakhlak mulia.",
    },
    {
      type: "paragraph",
      content:
        "Dalam perjalanannya, SDN Gadungan 02 terus berkembang dari segi fasilitas maupun kualitas pendidikan. Berbagai prestasi telah diraih baik dalam bidang akademik maupun non-akademik, menjadikan sekolah ini sebagai institusi pendidikan yang diperhitungkan di wilayahnya.",
    },
    {
      type: "highlight",
      title: "Visi Sekolah",
      content:
        '"Mewujudkan generasi yang cerdas, berkarakter, dan berdaya saing global dengan berlandaskan iman dan takwa"',
    },
    {
      type: "paragraph",
      content:
        "Dengan dukungan guru-guru yang profesional dan fasilitas yang terus ditingkatkan, SDN Gadungan 02 berkomitmen untuk terus memberikan yang terbaik bagi peserta didik dan masyarakat.",
    },
  ];

  const statsData = [
    { title: "Tahun Berdiri", value: "1970", color: "blue" },
    { title: "Jumlah Siswa", value: "150+", color: "amber" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg overflow-hidden">
          <CardBody className="p-8">
            <Typography
              variant="h2"
              color="blue-gray"
              className="mb-8 text-3xl font-bold text-center">
              Sejarah SDN Gadungan 02
            </Typography>

            <div className="prose max-w-none">
              {historyData.map((item, index) => {
                if (item.type === "paragraph") {
                  return (
                    <Typography
                      key={index}
                      variant="paragraph"
                      className="mb-6 text-gray-700 text-lg leading-relaxed">
                      {item.content}
                    </Typography>
                  );
                } else if (item.type === "highlight") {
                  return (
                    <div
                      key={index}
                      className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500 my-8">
                      <Typography
                        variant="h4"
                        className="text-xl font-semibold text-blue-800 mb-3">
                        {item.title}
                      </Typography>
                      <Typography className="text-blue-700">
                        {item.content}
                      </Typography>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {statsData.map((stat, index) => (
                <Card
                  key={index}
                  className={`bg-gradient-to-r from-${stat.color}-50 to-${stat.color}-100`}>
                  <CardBody>
                    <Typography
                      variant="h5"
                      className={`text-${stat.color}-800 mb-3`}>
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      className={`text-${stat.color}-600`}>
                      {stat.value}
                    </Typography>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default HistoryPage;
