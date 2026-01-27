"use server";

import User from "@/database/user.model";
import Course from "@/database/course.model";
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

export async function getUserPurchasedCourses(): Promise<ICourse[] | null> {
  try {
    await connectToDatabase();
    const { userId } = await auth();
    const user = await User.findOne({ clerkId: userId }).populate("purchasedCourses");
    return user?.purchasedCourses || [];
  } catch (error) {
    console.error("❌ getUserPurchasedCourses failed:", error);
    throw error;
  }
}

/**
 * Get all users (Admin)
 */
export async function getAllUsers() {
  try {
    await connectToDatabase();

    const users = await User.find()
      .populate("courses", "title")
      .populate("purchasedCourses", "title")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error("❌ getAllUsers failed:", error);
    return [];
  }
}

/**
 * Update user status (Admin)
 */
export async function updateUserStatus(userId: string, status: string) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    user.status = status;
    await user.save();

    return {
      success: true,
      message: "User status updated successfully",
      data: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    console.error("❌ updateUserStatus failed:", error);
    return { success: false, message: "Failed to update user status" };
  }
}

/**
 * Update user role (Admin)
 */
export async function updateUserRole(userId: string, role: string) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    user.role = role;
    await user.save();

    return {
      success: true,
      message: "User role updated successfully",
      data: JSON.parse(JSON.stringify(user)),
    };
  } catch (error) {
    console.error("❌ updateUserRole failed:", error);
    return { success: false, message: "Failed to update user role" };
  }
}