import { getCourseBySlug } from "@/app/lib/actions/course.actions";
import { getLessonBySlug } from "@/app/lib/actions/lesson.actions";
import { getCourseProgress, updateCurrentLesson } from "@/app/lib/actions/progress.actions";
import { getUserInfo } from "@/app/lib/actions/user.actions";
import { getCommentsByLesson } from "@/app/lib/actions/comment.actions";
import { EUserRole } from "@/app/types/enums";
import LessonDetail from "@/components/lesson/LessonDetail";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        courseSlug: string;
        lessonSlug: string;
    };
}

export default async function LessonPage({ params }: PageProps) {
    const { userId } = await auth();
    if (!userId) return notFound();
    const user = await getUserInfo({ clerkId: userId });

    if (!user) {
        return notFound();
    }

    const { courseSlug, lessonSlug } = params;


    const course = await getCourseBySlug({ slug: courseSlug });


    if (!course) {
        return notFound();
    }
    // if (!user.courses.includes(course._id.toString()) || user.role !== EUserRole.ADMIN) {
    //     return notFound();
    // }
    const lessonResult = await getLessonBySlug(lessonSlug, course._id.toString());

    if (!lessonResult.success || !lessonResult.data) {
        return notFound();
    }

    const lesson = lessonResult.data;
    const commentsResult = await getCommentsByLesson(lesson._id.toString());
    const comments = commentsResult.success ? commentsResult.data : [];

    const userRating = course.rating.find((_: any, index: number) =>
        course.ratedBy[index]?.toString() === user._id.toString()
    ) || 0;

    const progressData = await getCourseProgress(courseSlug);

    const courseData = JSON.parse(JSON.stringify(course));
    const courseId = course._id.toString();

    return (
        <LessonDetail
            lesson={lesson}
            course={courseData}
            courseSlug={courseSlug}
            courseId={courseId}
            userId={user._id.toString()}
            clerkId={userId}
            isAdmin={user.role === EUserRole.ADMIN}
            comments={comments}
            userRating={userRating}
            completedLessons={progressData.completedLessons}
            progress={progressData.progress}
            totalLessons={progressData.totalLessons}
            completedCount={progressData.completedCount}
        />
    );
}
