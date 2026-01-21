import React from "react";
import CourseCard from "./CourseCard";

import { getAllCourses } from "@/app/lib/actions/course.actions";
import { ICourse } from "@/database/course.model";

const CourseGrid = async () => {
  const courses = await getAllCourses();
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses?.map((course: ICourse) => (
        <CourseCard key={course.slug} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;
