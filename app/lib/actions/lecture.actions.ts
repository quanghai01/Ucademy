"use server";

import Lecture, { ILecture } from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import Course from "@/database/course.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";


export async function getLecturesByCourse(courseSlug: string) {
    try {
        await connectToDatabase();

        const course = await Course.findOne({ slug: courseSlug }).lean();
        if (!course) {
            return { success: false, message: "Course not found" };
        }

        const lectures = await Lecture.find({
            course: course._id,
            _destroy: { $ne: true },
        })
            .sort({ order: 1 })
            .lean();


        const lecturesWithLessons = await Promise.all(
            lectures.map(async (lecture) => {
                const lessons = await Lesson.find({
                    lecture: lecture._id,
                    _destroy: { $ne: true },
                })
                    .sort({ order: 1 })
                    .lean();

                return {
                    ...lecture,
                    lessons,
                };
            })
        );

        return {
            success: true,
            data: JSON.parse(JSON.stringify(lecturesWithLessons)),
        };
    } catch (error) {
        console.error("[GET_LECTURES_BY_COURSE]", error);
        return { success: false, message: "Failed to fetch lectures" };
    }
}


export async function createLecture(params: {
    courseSlug: string;
    title: string;
    order?: number;
}) {
    try {
        await connectToDatabase();

        const course = await Course.findOne({ slug: params.courseSlug }).lean();
        if (!course) {
            return { success: false, message: "Course not found" };
        }


        const lastLecture = await Lecture.findOne({ course: course._id })
            .sort({ order: -1 })
            .lean();

        const newLecture = await Lecture.create({
            title: params.title,
            course: course._id,
            order: params.order ?? (lastLecture ? lastLecture.order + 1 : 0),
            lessons: [],
        });

        await Course.findByIdAndUpdate(course._id, {
            $push: { lectures: newLecture._id },
        });

        revalidatePath(`/manage/course/update_lecture`);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newLecture)),
        };
    } catch (error) {
        console.error("[CREATE_LECTURE]", error);
        return { success: false, message: "Failed to create lecture" };
    }
}


export async function updateLecture(params: {
    lectureId: string;
    title?: string;
    order?: number;
}) {
    try {
        await connectToDatabase();

        const updateData: any = {};
        if (params.title !== undefined) updateData.title = params.title;
        if (params.order !== undefined) updateData.order = params.order;

        const updatedLecture = await Lecture.findByIdAndUpdate(
            params.lectureId,
            { $set: updateData },
            { new: true }
        ).lean();

        if (!updatedLecture) {
            return { success: false, message: "Lecture not found" };
        }

        revalidatePath(`/manage/course/update_lecture`);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(updatedLecture)),
        };
    } catch (error) {
        console.error("[UPDATE_LECTURE]", error);
        return { success: false, message: "Failed to update lecture" };
    }
}


export async function deleteLecture(lectureId: string) {
    try {
        await connectToDatabase();

        const lecture = await Lecture.findByIdAndUpdate(
            lectureId,
            { $set: { _destroy: true } },
            { new: true }
        ).lean();

        if (!lecture) {
            return { success: false, message: "Lecture not found" };
        }


        await Lesson.updateMany(
            { lecture: lectureId },
            { $set: { _destroy: true } }
        );

        revalidatePath(`/manage/course/update_lecture`);

        return { success: true, message: "Lecture deleted successfully" };
    } catch (error) {
        console.error("[DELETE_LECTURE]", error);
        return { success: false, message: "Failed to delete lecture" };
    }
}


export async function reorderLectures(params: {
    courseSlug: string;
    lectureIds: string[];
}) {
    try {
        await connectToDatabase();


        const updates = params.lectureIds.map((id, index) =>
            Lecture.findByIdAndUpdate(id, { $set: { order: index } })
        );

        await Promise.all(updates);

        revalidatePath(`/manage/course/update_lecture`);

        return { success: true, message: "Lectures reordered successfully" };
    } catch (error) {
        console.error("[REORDER_LECTURES]", error);
        return { success: false, message: "Failed to reorder lectures" };
    }
}
