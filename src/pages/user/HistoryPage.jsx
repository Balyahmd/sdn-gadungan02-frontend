import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import HistoryService from "../../services/historyService";

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await HistoryService.getHistory();
        const { text_sejarah, visi } = response.data;

        const parsed = [];

        if (text_sejarah) {
          const paragraphs = text_sejarah.split(/\n\s*\n/);
          paragraphs.forEach((p) =>
            parsed.push({ type: "paragraph", content: p.trim() })
          );
        }

        if (visi) {
          parsed.push({
            type: "highlight",
            title: "Visi Sekolah",
            content: visi,
          });
        }

        setHistoryData(parsed);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
    fetchHistory();
  }, []);

  const statsData = [
    { title: "Tahun Berdiri", value: "1970", color: "blue" },
    { title: "Jumlah Siswa", value: "150+", color: "amber" },
  ];

  const colorMap = {
    blue: {
      bg: "from-blue-50 to-blue-100",
      textTitle: "text-blue-800",
      textValue: "text-blue-600",
    },
    amber: {
      bg: "from-amber-50 to-amber-100",
      textTitle: "text-amber-800",
      textValue: "text-amber-600",
    },
  };

  return (
    <div className="min-h-[calc(100vh-300px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg overflow-hidden">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4">
                <BookOpenIcon className="h-8 w-8 text-green-700" />
              </div>
              <Typography
                variant="h2"
                className="text-3xl font-bold text-center text-blackColor">
                Sejarah SDN Gadungan 02
              </Typography>
              <Typography variant="lead" className="text-green-700">
                Berikut ini adalah sejarah SDN Gadungan 02
              </Typography>
            </div>

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
              {statsData.map((stat, index) => {
                const color = colorMap[stat.color] || {};
                return (
                  <Card key={index} className={`bg-gradient-to-r ${color.bg}`}>
                    <CardBody>
                      <Typography
                        variant="h5"
                        className={`${color.textTitle} mb-3`}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h3" className={color.textValue}>
                        {stat.value}
                      </Typography>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default HistoryPage;
