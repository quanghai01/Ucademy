import { CourseAddNew } from "@/components/course/CourseAddNew";
import Heading from "@/components/typography/Heading";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading>Tạo khóa học mới</Heading>
      <CourseAddNew />
    </div>
  );
};

export default page;
