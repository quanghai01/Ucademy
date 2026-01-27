export const dynamic = "force-dynamic";

import { getCourseBySlug, incrementCourseViews } from "@/app/lib/actions/course.actions";
import CourseDetail from "@/components/course/CourseDetail";
import Heading from "@/components/typography/Heading";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CoursePage({ params }: PageProps) {
  const slug = params?.slug;

  const findCourse = await getCourseBySlug({ slug });
  if (!findCourse) return null;

  await incrementCourseViews(slug);

  const course = JSON.parse(JSON.stringify(findCourse));

  return (
    <div>
      <Heading>Chi tiết khóa học</Heading>
      <CourseDetail course={course} />
    </div>
  );
}
