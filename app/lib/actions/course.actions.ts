"use server";

import Course, { ICourse } from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { connectToDatabase } from "../mongoose";
import { TCreateCourseParams, TUpdateCourseParams } from "@/app/types";


export async function createCourse(params: TCreateCourseParams) {
  try {
    await connectToDatabase();

    const existing = await Course.findOne({ slug: params.slug }).lean();
    if (existing) return existing;

    const payload = {
      title: params.title,
      slug: params.slug,
      desc: params.desc,
      price: params.price,
      sale_price: params.sale_price,
      level: params.level,
    };

    const newCourse = await Course.create(payload);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newCourse)),
    };
  } catch (error) {
    console.error("❌ Create course failed:", error);
    throw error;
  }
}

export async function updateCourse({ slug, updateData }: TUpdateCourseParams) {
  try {
    await connectToDatabase();

    const updatedCourse = await Course.findOneAndUpdate(
      { slug },
      {
        $set: updateData,
      },
      {
        new: true,
      }
    ).lean();

    if (!updatedCourse) {
      throw new Error("COURSE_NOT_FOUND");
    }

    // revalidatePath("/manage/courses");
    // revalidatePath(`/courses/${slug}`);

    return {
      success: true,
      data: updatedCourse,
    };
  } catch (error) {
    console.error("[UPDATE_COURSE_ERROR]", error);

    return {
      success: false,
      message: "Cập nhật khóa học thất bại",
    };
  }
}

export async function deleteCourse(slug: string) {
  try {
    await connectToDatabase();

    const deletedCourse = await Course.findOneAndDelete({ slug }).lean();
    if (!deletedCourse) {
      throw new Error("COURSE_NOT_FOUND");
    }

    return {
      success: true,
      data: deletedCourse,
    };
  } catch (error) {
    console.error("[DELETE_COURSE_ERROR]", error);

    return {
      success: false,
      message: "Xóa khóa học thất bại",
    };
  }
}

export async function getCourseBySlug({
  slug,
}: {
  slug: string;
}): Promise<ICourse | null> {
  try {
    await connectToDatabase();


    if (!Lecture || !Lesson) {
      throw new Error("Models not loaded");
    }

    const course = await Course.findOne({ slug })
      .populate({
        path: 'lectures',
        model: 'Lecture',
        match: { _destroy: { $ne: true } },
        options: { sort: { order: 1 } },
        populate: {
          path: 'lessons',
          model: 'Lesson',
          match: { _destroy: { $ne: true } },
          options: { sort: { order: 1 } }
        }
      })
      .lean()
      .exec();

    console.log("[getCourseBySlug] Found course:", course?.title);
    console.log("[getCourseBySlug] Lectures count:", course?.lectures?.length);

    return course as ICourse;
  } catch (error) {
    console.error("[getCourseBySlug]", error);
    return null;
  }
}

export async function getAllCourses() {
  try {
    await connectToDatabase();

    // Only select necessary fields to reduce data transfer
    const courses = await Course.find({ _destroy: { $ne: true } })
      .select('title slug image price sale_price level views rating author status')
      .lean();

    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.log(error);
    return [];
  }
}


/**
 * Get the URL to the first lesson of a course
 * Returns null if course has no lectures or lessons
 */
export async function getFirstLessonUrl(courseSlug: string): Promise<string | null> {
  try {
    await connectToDatabase();

    const course = await Course.findOne({ slug: courseSlug })
      .populate({
        path: 'lectures',
        model: 'Lecture',
        match: { _destroy: { $ne: true } },
        options: { sort: { order: 1 }, limit: 1 },
        populate: {
          path: 'lessons',
          model: 'Lesson',
          match: { _destroy: { $ne: true } },
          options: { sort: { order: 1 }, limit: 1 }
        }
      })
      .lean()
      .exec();

    if (!course) return null;

    const lectures = course.lectures as any[];
    if (!lectures || lectures.length === 0) return null;

    const firstLecture = lectures[0];
    const lessons = firstLecture.lessons as any[];
    if (!lessons || lessons.length === 0) return null;

    const firstLesson = lessons[0];
    return `/${courseSlug}/lessons/${firstLesson.slug}`;
  } catch (error) {
    console.error("[getFirstLessonUrl]", error);
    return null;
  }
}


/**
 * Get the URL to the current lesson a user is studying for a course
 * Falls back to first lesson if no progress exists
 */
export async function getCurrentLessonUrl(userId: string, courseSlug: string): Promise<string | null> {
  try {
    await connectToDatabase();
    console.log(`[getCurrentLessonUrl] START - userId: ${userId}, courseSlug: ${courseSlug}`);

    // Import User model
    const User = (await import("@/database/user.model")).default;

    // Get course first
    const course = await Course.findOne({ slug: courseSlug }).lean();
    if (!course) {
      console.log(`[getCurrentLessonUrl] Course not found`);
      return null;
    }
    console.log(`[getCurrentLessonUrl] Course found: ${course._id}`);

    // Get user's progress for this course
    const user = await User.findOne({ clerkId: userId })
      .populate({
        path: 'courseProgress.currentLesson',
        model: 'Lesson',
      })
      .lean();

    if (!user) {
      console.log(`[getCurrentLessonUrl] User not found, fallback to first lesson`);
      return getFirstLessonUrl(courseSlug);
    }

    console.log(`[getCurrentLessonUrl] User courseProgress:`, user.courseProgress);

    // Find the course progress entry
    const courseProgressEntry = (user.courseProgress || []).find(
      (progress: any) => progress.course.toString() === course._id.toString()
    );

    console.log(`[getCurrentLessonUrl] Found progress entry:`, courseProgressEntry);

    if (courseProgressEntry && courseProgressEntry.currentLesson) {
      const currentLesson = courseProgressEntry.currentLesson as any;
      const url = `/${courseSlug}/lessons/${currentLesson.slug}`;
      console.log(`[getCurrentLessonUrl] Returning current lesson URL: ${url}`);
      return url;
    }

    // No progress found, return first lesson
    console.log(`[getCurrentLessonUrl] No progress, fallback to first lesson`);
    return getFirstLessonUrl(courseSlug);
  } catch (error) {
    console.error("[getCurrentLessonUrl]", error);
    // Fallback to first lesson on error
    return getFirstLessonUrl(courseSlug);
  }
}
