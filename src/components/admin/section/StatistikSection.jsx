import { useEffect, useState } from "react";
import { DocumentTextIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import { TbView360 } from "react-icons/tb";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import PostService from "../../../services/postService";
import TeacherService from "../../../services/teacherService";
import VirtualTourService from "../../../services/virtualtourService";

function StatistikSection() {
  const [state] = useState({
    searchTerm: "",
  });
  const { searchTerm } = state;
  const [counts, setCounts] = useState({
    posts: 0,
    teachers: 0,
    virtuals: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [posts, teachers, panoramas] = await Promise.all([
          PostService.getPosts(searchTerm),
          TeacherService.getTeachers(searchTerm),
          VirtualTourService.getPanoramas(),
        ]);

        setCounts({
          posts: posts.data.length,
          teachers: teachers.data.length,
          virtuals: panoramas.data.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    {
      title: "Total Postingan",
      value: counts.posts,
      icon: <DocumentTextIcon className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Total Guru",
      value: counts.teachers,
      icon: <AcademicCapIcon className="h-6 w-6" />,
      color: "bg-green-500",
    },
    {
      title: "Virtual Tour 360",
      value: counts.virtuals,
      icon: <TbView360 className="h-6 w-6" />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardBody className="flex items-center justify-between p-6">
            <div>
              <Typography variant="h6" className="text-gray-600 mb-2">
                {stat.title}
              </Typography>
              <Typography variant="h3" className="text-2xl font-bold">
                {stat.value}
              </Typography>
            </div>
            <div className={`${stat.color} p-3 rounded-full text-white`}>
              {stat.icon}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default StatistikSection;
