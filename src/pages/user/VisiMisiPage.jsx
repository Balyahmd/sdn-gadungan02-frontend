import React, { useEffect, useState } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import logo from "../../assets/logo_sdn_gadungan02.png";
import VisiMisiService from "../../services/visiMisiService";
import { StarIcon } from "@heroicons/react/24/solid";

const VisiMisiPage = () => {
  const [data, setData] = useState({
    visi: "",
    misi: [""],
    tujuan: [""],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchVisiMisi = async () => {
      try {
        setError(null); // reset error sebelum fetch
        setLoading(true);
        const result = await VisiMisiService.getVisiMisi();
        console.log(result);
        setData({
          visi: result.data.text_visi || "Visi sekolah belum tersedia",
          misi: Array.isArray(result.data.text_misi)
            ? result.data.text_misi
            : [result.data.text_misi || "Misi sekolah belum tersedia"],
          tujuan: Array.isArray(result.data.text_tujuan)
            ? result.data.text_tujuan
            : [result.data.text_tujuan || "Tujuan sekolah belum tersedia"],
        });
      } catch (err) {
        setError("Gagal memuat data visi misi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisiMisi();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-[calc(100vh-300px)] py-8 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardBody className="p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 mb-4">
                <StarIcon className="h-8 w-8 text-green-700" />
              </div>
              <Typography
                variant="h2"
                className="text-3xl font-bold text-center text-blackColor">
                Visi Misi & Tujuan
              </Typography>
              <Typography variant="lead" className="text-green-700">
                Berikut ini adalah visi, misi, dan tujuan sekolah SDN Gadungan
                02
              </Typography>
            </div>

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
              <Typography
                variant="paragraph"
                className="text-gray-700 font-normal text-lg">
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
              <Typography
                variant="paragraph"
                className="text-gray-700 font-normal text-lg mb-2">
                Mengacu pada visi sekolah di atas, maka misi yang akan
                dilaksanakan adalah sebagai berikut :
              </Typography>
              <ol className="list-decimal pl-6 space-y-2">
                {Array.isArray(data.misi) ? (
                  data.misi.map((mission, index) => (
                    <li key={index}>{mission}</li>
                  ))
                ) : (
                  <li>{data.misi || "Tidak ada misi"}</li>
                )}
              </ol>
            </div>

            {/* Tujuan Section */}
            <div>
              <Typography
                variant="h3"
                className="text-2xl font-bold mb-4 text-green-700">
                Tujuan
              </Typography>
              <Typography
                variant="paragraph"
                className="text-gray-700 font-normal text-lg mb-2">
                Dengan berpedoman pada visi dan misi yang telah dirumuskan serta
                kondisi di sekolah tujuan sekolah yang ingin dicapai sebagai
                berikut:
              </Typography>
              <ol className="list-decimal pl-6 space-y-3">
                {Array.isArray(data.tujuan) ? (
                  data.tujuan.map((goal, index) => <li key={index}>{goal}</li>)
                ) : (
                  <li>{data.tujuan || "Tidak ada tujuan"}</li>
                )}
              </ol>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default VisiMisiPage;
