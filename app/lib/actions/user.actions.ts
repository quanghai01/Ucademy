"use server";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { TCreateUserParams } from "@/app/types";

export default async function createUser(params: TCreateUserParams) {
  try {
    await connectToDatabase();

    const existing = await User.findOne({ clerkId: params.clerkId });
    if (existing) return existing;

    const newUser = await User.create({
      ...params,
      username: params.username ?? undefined,
    });

    return newUser;
  } catch (error: any) {
    console.error("❌ Create user failed:", error);
    throw error;
  }
}
