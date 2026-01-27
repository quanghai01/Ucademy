import { getUserPurchasedCourses } from "@/app/lib/actions/user.actions";
import { getCurrentLessonUrl } from "@/app/lib/actions/course.actions";
import CourseCard from "@/components/course/CourseCard";
import CourseGrid from "@/components/course/CourseGrid";

import Heading from "@/components/typography/Heading";
import React from "react";
import { auth } from "@clerk/nextjs/server";

const page = async () => {
  const courses = await getUserPurchasedCourses();
  const { userId } = await auth();

  if (!userId) {
    return (
      <div>
        <Heading>Khu vực học tập</Heading>
        <p className="text-gray-500">Vui lòng đăng nhập để xem khóa học của bạn.</p>
      </div>
    );
  }


  const coursesWithUrls = await Promise.all(
    (courses || []).map(async (course) => {
      const lessonUrl = await getCurrentLessonUrl(userId, course.slug);
      return {
        course,
        lessonUrl,
      };
    })
  );
  console.log("🚀 ~ page ~ coursesWithUrls:", coursesWithUrls)

  return (
    <div>
      <Heading>Khu vực học tập</Heading>

      <CourseGrid>
        {coursesWithUrls.map(({ course, lessonUrl }) => (
          <CourseCard
            key={course._id.toString()}
            course={course}
            cta="tiếp tục học"
            href={lessonUrl || `/course/${course.slug}`}
          />
        ))}
      </CourseGrid>
    </div>
  );
};

export default page;
