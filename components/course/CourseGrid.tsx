import React from "react";
import CourseCard from "./CourseCard";

import { getAllCourses } from "@/app/lib/actions/course.actions";
import { ICourse } from "@/database/course.model";

const CourseGrid = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
};

export default CourseGrid;
