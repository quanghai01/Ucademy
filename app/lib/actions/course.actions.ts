"use server";

import Course, { ICourse } from "@/database/course.model";
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

    const course = await Course.findOne({ slug }).lean<ICourse>();
    return course;
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


