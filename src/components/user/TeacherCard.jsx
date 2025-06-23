import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Avatar,
} from "@material-tailwind/react";

const TeacherCard = ({ nama_guru, pas_foto, keterangan_guru, nip }) => {
  return (
    <Card className="w-72 shadow-lg rounded-xl transition duration-300 hover:shadow-green-200 hover:scale-105 hover:border hover:border-green-700">
      <CardHeader floated={false} className="max-h-64">
        <img
          src={pas_foto}
          alt={`Foto ${nama_guru}`}
          className="h-full w-full object-cover rounded-t-xl 
                 transition-transform duration-300 ease-in-out
                hover:scale-105
                shadow-md"
        />
      </CardHeader>
      <CardBody>
        <Typography
          variant="h5"
          color="blue-gray"
          className="mb-2 font-semibold text-gray-800">
          {nama_guru}
        </Typography>
        <Typography className="text-gray-600 mb-1">
          {keterangan_guru}
        </Typography>
        <Typography variant="small" className="text-gray-500">
          NIP: {nip}
        </Typography>
      </CardBody>
    </Card>
  );
};

export default TeacherCard;
