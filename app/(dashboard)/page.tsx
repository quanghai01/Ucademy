import Heading from "@/components/typography/Heading";
import React from "react";

import CourseGrid from "@/components/course/CourseGrid";


const page = async () => {

  return (
    <div>
      <Heading>Khám phá</Heading>

      <CourseGrid />
    </div>
  );
};

export default page;
