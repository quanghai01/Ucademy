"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { TCreateUserParams } from "@/app/types";

export default async function createUser(params: TCreateUserParams) {
  await connectToDatabase();

  try {
    // Check tồn tại theo clerkId (quan trọng)
    const existingUser = await User.findOne({ clerkId: params.clerkId });
    if (existingUser) {
      return existingUser;
    }

    const newUser = await User.create({
      ...params,
      username: params.username ?? undefined, // tránh null
    });

    return newUser;
  } catch (error: any) {
    console.error("❌ Create user failed:", error);

    // duplicate key → trả user cũ
    if (error.code === 11000) {
      const user = await User.findOne({
        $or: [{ clerkId: params.clerkId }, { email: params.email }],
      });
      if (user) return user;
    }

    throw new Error("Failed to create user");
  }
}
