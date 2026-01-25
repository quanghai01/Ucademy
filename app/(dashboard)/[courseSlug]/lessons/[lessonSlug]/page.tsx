import { getCourseBySlug } from "@/app/lib/actions/course.actions";
import { getLessonBySlug } from "@/app/lib/actions/lesson.actions";
import { getCourseProgress, updateCurrentLesson } from "@/app/lib/actions/progress.actions";
import { getUserInfo } from "@/app/lib/actions/user.actions";
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
    console.log("🚀 ~ LessonPage ~ user:", user)

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

    console.log('📚 [Lesson Page] Loading lesson:', {
        courseSlug,
        lessonSlug,
        courseId: course._id.toString(),
        lessonId: lesson._id.toString()
    });

    // 🎯 TRACK CURRENT LESSON - Simple server-side approach
    const trackResult = await updateCurrentLesson({
        courseId: course._id.toString(),
        lessonId: lesson._id.toString(),
    });

    console.log('✅ [Lesson Page] Track result:', trackResult);

    const progressData = await getCourseProgress(courseSlug);

    const courseData = JSON.parse(JSON.stringify(course));
    const courseId = course._id.toString(); // Store ID before serialization

    return (
        <LessonDetail
            lesson={lesson}
            course={courseData}
            courseSlug={courseSlug}
            courseId={courseId}
            completedLessons={progressData.completedLessons}
            progress={progressData.progress}
            totalLessons={progressData.totalLessons}
            completedCount={progressData.completedCount}
        />
    );
}
