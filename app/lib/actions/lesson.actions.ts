"use server";

import Lesson from "@/database/lesson.model";
import Lecture from "@/database/lecture.model";
import Course from "@/database/course.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { ELessonType } from "@/app/types/enums";


export async function createLesson(params: {
    lectureId: string;
    courseSlug: string;
    title: string;
    content?: string;
    video_url?: string;
    duration?: number;
    type?: ELessonType;
    order?: number;
}) {
    try {
        await connectToDatabase();

        const course = await Course.findOne({ slug: params.courseSlug }).lean();
        if (!course) {
            return { success: false, message: "Course not found" };
        }

        const lecture = await Lecture.findById(params.lectureId).lean();
        if (!lecture) {
            return { success: false, message: "Lecture not found" };
        }


        const lastLesson = await Lesson.findOne({ lecture: params.lectureId })
            .sort({ order: -1 })
            .lean();

        // Generate order number for the new lesson
        const order = params.order ?? (lastLesson ? lastLesson.order + 1 : 0);

        // Use order-based slug pattern: bai-1, bai-2, etc.
        const slug = `bai-${order + 1}`;

        const newLesson = await Lesson.create({
            title: params.title,
            slug,
            content: params.content || "",
            video_url: params.video_url || "",
            duration: params.duration || 0,
            type: params.type || ELessonType.VIDEO,
            lecture: params.lectureId,
            course: course._id,
            order: order,
        });


        await Lecture.findByIdAndUpdate(params.lectureId, {
            $push: { lessons: newLesson._id },
        });

        revalidatePath(`/manage/course/update_lecture`);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newLesson)),
        };
    } catch (error) {
        console.error("[CREATE_LESSON]", error);
        return { success: false, message: "Failed to create lesson" };
    }
}


export async function updateLesson(params: {
    lessonId: string;
    title?: string;
    content?: string;
    video_url?: string;
    duration?: number;
    type?: ELessonType;
    order?: number;
}) {
    try {
        await connectToDatabase();

        const updateData: any = {};
        if (params.title !== undefined) {
            updateData.title = params.title;
            // Do NOT update slug when title changes - keeps URLs stable
        }
        if (params.content !== undefined) updateData.content = params.content;
        if (params.video_url !== undefined) updateData.video_url = params.video_url;
        if (params.duration !== undefined) updateData.duration = params.duration;
        if (params.type !== undefined) updateData.type = params.type;
        if (params.order !== undefined) {
            updateData.order = params.order;
            // Update slug when order changes
            updateData.slug = `bai-${params.order + 1}`;
        }

        const updatedLesson = await Lesson.findByIdAndUpdate(
            params.lessonId,
            { $set: updateData },
            { new: true }
        ).lean();

        if (!updatedLesson) {
            return { success: false, message: "Lesson not found" };
        }

        revalidatePath(`/manage/course/update_lecture`);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(updatedLesson)),
        };
    } catch (error) {
        console.error("[UPDATE_LESSON]", error);
        return { success: false, message: "Failed to update lesson" };
    }
}


export async function deleteLesson(lessonId: string) {
    try {
        await connectToDatabase();

        const lesson = await Lesson.findByIdAndUpdate(
            lessonId,
            { $set: { _destroy: true } },
            { new: true }
        ).lean();

        if (!lesson) {
            return { success: false, message: "Lesson not found" };
        }

        revalidatePath(`/manage/course/update_lecture`);

        return { success: true, message: "Lesson deleted successfully" };
    } catch (error) {
        console.error("[DELETE_LESSON]", error);
        return { success: false, message: "Failed to delete lesson" };
    }
}


export async function reorderLessons(params: {
    lectureId: string;
    lessonIds: string[];
}) {
    try {
        await connectToDatabase();


        const updates = params.lessonIds.map((id, index) =>
            Lesson.findByIdAndUpdate(id, { $set: { order: index } })
        );

        await Promise.all(updates);

        revalidatePath(`/manage/course/update_lecture`);

        return { success: true, message: "Lessons reordered successfully" };
    } catch (error) {
        console.error("[REORDER_LESSONS]", error);
        return { success: false, message: "Failed to reorder lessons" };
    }
}

export async function getLessonBySlug(slug: string, course_id: string) {
    try {
        await connectToDatabase();

        const lesson = await Lesson.findOne({ slug, course: course_id }).lean();

        if (!lesson) {
            return { success: false, message: "Lesson not found" };
        }

        return { success: true, data: JSON.parse(JSON.stringify(lesson)) };
    } catch (error) {
        console.error("[GET_LESSON_BY_SLUG]", error);
        return { success: false, message: "Failed to get lesson by slug" };
    }
}