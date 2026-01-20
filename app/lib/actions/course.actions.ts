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
    const courses = Course.find();
    return courses;
  } catch (error) {
    console.log(error);
  }
}
