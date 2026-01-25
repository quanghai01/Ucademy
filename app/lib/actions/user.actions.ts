"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { TCreateUserParams } from "@/app/types";
import { auth } from "@clerk/nextjs/server";
import { ICourse } from "@/database/course.model";


export async function createUser(params: TCreateUserParams) {
  try {
    await connectToDatabase();

    const existing = await User.findOne({ clerkId: params.clerkId });
    if (existing) return existing;

    const payload: Partial<TCreateUserParams> = {
      clerkId: params.clerkId,
      email: params.email,
      name: params.name,
      avatar: params.avatar,
    };

    if (params.username && params.username.trim() !== "") {
      payload.username = params.username;
    }

    const newUser = await User.create(payload);
    return newUser;
  } catch (error) {
    console.error("❌ Create user failed:", error);
    throw error;
  }
}

export async function getUserInfo({ clerkId }: { clerkId: string }) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId }).lean();
    return user;
  } catch (error) {
    console.error("❌ getUserInfo failed:", error);
    throw error;
  }
}

export async function getUserCourses(): Promise<ICourse[] | null> {
  try {
    await connectToDatabase();
    const { userId } = await auth();
    const user = await User.findOne({ clerkId: userId }).populate("courses");
    return user?.courses || [];
  } catch (error) {
    console.error("❌ getUserCourses failed:", error);
    throw error;
  }
}