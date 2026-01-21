import CourseManage from "@/components/course/CourseManage";
import { getAllCourses } from "@/app/lib/actions/course.actions";
import React from "react";


const page = async () => {
  const courses = await getAllCourses();
  return <div><CourseManage courses={courses} /></div>;
};

export default page;
