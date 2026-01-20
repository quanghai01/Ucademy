import { getCourseBySlug } from "@/app/lib/actions/course.actions";
import CourseUpdate from "@/components/course/CourseUpdate";
import Heading from "@/components/typography/Heading";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const findCourse = await getCourseBySlug({
    slug: searchParams.slug,
  });
  const courseData = JSON.parse(JSON.stringify(findCourse));
  if (!findCourse) return null;
  return (
    <div>
      <Heading>Cập nhật khóa học</Heading>
      <CourseUpdate course={courseData} />
    </div>
  );
};

export default page;
