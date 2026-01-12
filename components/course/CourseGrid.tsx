import React from "react";
import CourseCard from "./CourseCard";
import { Course } from "@/app/types";

const CourseGrid = () => {
  const courses: Course[] = [
    {
      id: "react-basic",
      title: "React cơ bản cho người mới bắt đầu",
      thumbnail: "https://picsum.photos/300/200?random=1",
      followers: 1520,
      instructor: "Nguyễn Văn A",
      level: "Beginner",
      isNew: true,
      price: 150000,
      rating: 4.5,
      reviewCount: 123,
    },
    {
      id: "nextjs-advanced",
      title: "Next.js nâng cao & kiến trúc hệ thống",
      thumbnail: "https://picsum.photos/300/200?random=2",
      followers: 980,
      instructor: "Trần Văn B",
      level: "Advanced",
      price: 150000,
      rating: 4.8,
      reviewCount: 98,
    },
    {
      id: "typescript-master",
      title: "TypeScript nâng cao cho dự án lớn",
      thumbnail: "https://picsum.photos/300/200?random=3",
      followers: 1230,
      instructor: "Lê Thị C",
      level: "Intermediate",
      price: 150000,
      rating: 4.3,
      reviewCount: 57,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;
