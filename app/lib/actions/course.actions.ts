"use server";

import Course, { ICourse } from "@/database/course.model";
import User from "@/database/user.model";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { connectToDatabase } from "../mongoose";
import { TCreateCourseParams, TUpdateCourseParams } from "@/app/types";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@clerk/nextjs/server";


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

    const courses = await Course.aggregate([
      { $match: { slug, _destroy: { $ne: true } } },
      {
        $lookup: {
          from: 'lectures',
          let: { courseId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $ne: ['$_destroy', true] }
                  ]
                }
              }
            },
            { $sort: { order: 1 } },
            {
              $lookup: {
                from: 'lessons',
                let: { lectureId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$lecture', '$$lectureId'] },
                          { $ne: ['$_destroy', true] }
                        ]
                      }
                    }
                  },
                  { $sort: { order: 1 } }
                ],
                as: 'lessons'
              }
            },
            {
              $addFields: {
                lectureDuration: { $sum: '$lessons.duration' }
              }
            }
          ],
          as: 'lectures'
        }
      },
      {
        $addFields: {
          totalDuration: { $sum: '$lectures.lectureDuration' }
        }
      }
    ]);

    const course = courses[0] || null;

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

    const courses = await Course.find({ _destroy: { $ne: true } })
      .select('title slug image price sale_price level views rating author status')
      .lean();

    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.log(error);
    return [];
  }
}



export async function getFirstLessonUrl(courseSlug: string): Promise<string | null> {
  try {
    await connectToDatabase();
    const course = await Course.findOne({ slug: courseSlug, _destroy: { $ne: true } })
      .select('_id')
      .lean();

    if (!course) return null;

    const firstLecture = await Lecture.findOne({
      course: course._id,
      _destroy: { $ne: true }
    })
      .sort({ order: 1 })
      .select('_id')
      .lean();

    if (!firstLecture) return null;

    const firstLesson = await Lesson.findOne({
      lecture: firstLecture._id,
      _destroy: { $ne: true }
    })
      .sort({ order: 1 })
      .select('slug')
      .lean();

    if (!firstLesson) return null;

    return `/${courseSlug}/lessons/${firstLesson.slug}`;
  } catch (error) {
    console.error("[getFirstLessonUrl]", error);
    return null;
  }
}


export async function getCurrentLessonUrl(userId: string, courseSlug: string): Promise<string | null> {
  try {
    await connectToDatabase();

    const User = (await import("@/database/user.model")).default;

    const course = await Course.findOne({ slug: courseSlug }).lean();
    if (!course) {
      console.log(`[getCurrentLessonUrl] Course not found`);
      return null;
    }


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


    const courseProgressEntry = (user.courseProgress || []).find(
      (progress: any) => progress.course.toString() === course._id.toString()
    );



    if (courseProgressEntry && courseProgressEntry.currentLesson) {
      const currentLesson = courseProgressEntry.currentLesson as any;
      const url = `/${courseSlug}/lessons/${currentLesson.slug}`;
      return url;
    }

    return getFirstLessonUrl(courseSlug);
  } catch (error) {
    console.error("[getCurrentLessonUrl]", error);
    return getFirstLessonUrl(courseSlug);
  }
}


export async function incrementCourseViews(slug: string) {
  try {
    await connectToDatabase();

    const course = await Course.findOneAndUpdate(
      { slug, _destroy: { $ne: true } },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!course) {
      return { success: false, message: "Course not found" };
    }


    revalidateTag('courses');
    revalidatePath('/');
    revalidatePath('/study');

    return { success: true, views: course.views };
  } catch (error) {
    console.error("❌ incrementCourseViews failed:", error);
    return { success: false, message: "Failed to increment views" };
  }
}

/**
 * Rate a course
 */
export async function rateCourse(courseId: string, rating: number) {
  try {
    await connectToDatabase();
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Check if user purchased the course
    const isPurchased = user.purchasedCourses.some(
      (id: any) => id.toString() === courseId
    );

    if (!isPurchased) {
      return { success: false, message: "You must purchase the course to rate it" };
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return { success: false, message: "Course not found" };
    }

    // Check if already rated
    const hasRated = course?.ratedBy?.some((id: any) => id.toString() === user._id.toString());
    if (hasRated) {
      return { success: false, message: "You have already rated this course" };
    }

    await course.addRating(rating, user._id.toString());

    revalidateTag("courses");
    revalidatePath("/");
    revalidatePath("/study");
    revalidatePath(`/course/${course.slug}`);

    return { success: true, message: "Thank you for your rating!" };
  } catch (error: any) {
    console.error("❌ rateCourse failed:", error);
    return { success: false, message: error.message || "Failed to rate course" };
  }
}
