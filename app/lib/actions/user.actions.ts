"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { TCreateUserParams } from "@/app/types";

export default async function createUser(params: TCreateUserParams) {
  try {
    // Kết nối MongoDB
    await connectToDatabase();
    console.log("✅ MongoDB connected, ready to create user");

    // Kiểm tra user đã tồn tại chưa
    const existing = await User.findOne({ clerkId: params.clerkId });
    if (existing) {
      console.log("ℹ️ User already exists:", existing.clerkId);
      return existing;
    }

    // Tạo user mới
    const newUser = await User.create({
      ...params,
      username: params.username ?? undefined,
    });

    console.log("🚀 User created:", newUser.clerkId);
    return newUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Create user failed:", error.message);
    } else {
      console.error("❌ Create user failed:", error);
    }
    throw error;
  }
}
