export const dynamic = "force-dynamic";

import Heading from "@/components/typography/Heading";
import React from "react";

import CourseGrid from "@/components/course/CourseGrid";
import { getAllCourses } from "../lib/actions/course.actions";
import { ICourse } from "@/database/course.model";
import CourseCard from "@/components/course/CourseCard";


const page = async () => {
  const courses = await getAllCourses();
  return (
    <div>
      <Heading>Khám phá</Heading>

      <CourseGrid>
        {courses?.map((course: ICourse) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </CourseGrid>
    </div>
  );
};

export default page;
