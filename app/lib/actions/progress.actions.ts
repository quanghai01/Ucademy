"use server";

import { auth } from "@clerk/nextjs/server";
import Progress from "@/database/progress.model";
import Lesson from "@/database/lesson.model";
import Course from "@/database/course.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";


export async function markLessonComplete(params: {
    courseSlug: string;
    lessonId: string;
}) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        await connectToDatabase();


        const course = await Course.findOne({ slug: params.courseSlug }).lean();
        if (!course) {
            return { success: false, message: "Course not found" };
        }

        const lesson = await Lesson.findById(params.lessonId).lean();
        if (!lesson) {
            return { success: false, message: "Lesson not found" };
        }


        await Progress.findOneAndUpdate(
            {
                user: userId,
                lesson: params.lessonId,
            },
            {
                user: userId,
                course: course._id,
                lesson: params.lessonId,
                completedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        revalidatePath(`/${params.courseSlug}/lessons/[lessonSlug]`);

        return { success: true, message: "Lesson marked as complete" };
    } catch (error) {
        console.error("[MARK_LESSON_COMPLETE]", error);
        return { success: false, message: "Failed to mark lesson complete" };
    }
}


export async function getCourseProgress(courseSlug: string) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                completedLessons: [],
                progress: 0,
                totalLessons: 0,
                completedCount: 0,
            };
        }

        await connectToDatabase();

        const course = await Course.findOne({ slug: courseSlug })
            .populate({
                path: "lectures",
                match: { _destroy: false },
                populate: {
                    path: "lessons",
                    match: { _destroy: false },
                },
            })
            .lean();

        if (!course) {
            return {
                success: false,
                completedLessons: [],
                progress: 0,
                totalLessons: 0,
                completedCount: 0,
            };
        }


        const completedProgress = await Progress.find({
            user: userId,
            course: course._id,
        })
            .select("lesson")
            .lean();

        const completedLessonIds = completedProgress.map((p) =>
            p.lesson.toString()
        );

        const totalLessons = (course.lectures as any[])?.reduce(
            (sum: number, lecture: any) => sum + (lecture.lessons?.length || 0),
            0
        ) || 0;


        const progress =
            totalLessons > 0
                ? Math.round((completedLessonIds.length / totalLessons) * 100)
                : 0;

        return {
            success: true,
            completedLessons: completedLessonIds,
            progress,
            totalLessons,
            completedCount: completedLessonIds.length,
        };
    } catch (error) {
        console.error("[GET_COURSE_PROGRESS]", error);
        return {
            success: false,
            completedLessons: [],
            progress: 0,
            totalLessons: 0,
            completedCount: 0,
        };
    }
}


export async function unmarkLessonComplete(params: {
    courseSlug: string;
    lessonId: string;
}) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        await connectToDatabase();

        await Progress.findOneAndDelete({
            user: userId,
            lesson: params.lessonId,
        });

        revalidatePath(`/${params.courseSlug}/lessons/[lessonSlug]`);

        return { success: true, message: "Lesson unmarked" };
    } catch (error) {
        console.error("[UNMARK_LESSON_COMPLETE]", error);
        return { success: false, message: "Failed to unmark lesson" };
    }
}


/**
 * Update the current lesson a user is viewing for a course
 * This tracks which lesson to continue from in the study area
 */
export async function updateCurrentLesson(params: {
    courseId: string;
    lessonId: string;
}) {
    try {
        const { userId } = await auth();

        if (!userId) {
            console.log("[updateCurrentLesson] No userId");
            return { success: false, message: "Unauthorized" };
        }

        console.log(`[updateCurrentLesson] userId: ${userId}, courseId: ${params.courseId}, lessonId: ${params.lessonId}`);

        await connectToDatabase();

        // Import User model
        const User = (await import("@/database/user.model")).default;

        // Update or insert the current lesson for this course
        await User.findOneAndUpdate(
            { clerkId: userId },
            {
                $pull: {
                    courseProgress: { course: params.courseId }
                }
            }
        );

        const result = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                $push: {
                    courseProgress: {
                        course: params.courseId,
                        currentLesson: params.lessonId,
                        lastAccessedAt: new Date(),
                    }
                }
            },
            { new: true }
        );

        console.log(`[updateCurrentLesson] Updated successfully. CourseProgress count: ${result?.courseProgress?.length}`);

        return { success: true, message: "Current lesson updated" };
    } catch (error) {
        console.error("[UPDATE_CURRENT_LESSON]", error);
        return { success: false, message: "Failed to update current lesson" };
    }
}
