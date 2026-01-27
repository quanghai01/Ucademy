"use server";

import Course from "@/database/course.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function getAllRatings() {
    try {
        await connectToDatabase();

        // Aggregate to flatten the rating and ratedBy arrays
        const ratingsData = await Course.aggregate([
            { $unwind: { path: "$rating", includeArrayIndex: "index" } },
            {
                $lookup: {
                    from: "users",
                    localField: "ratedBy",
                    foreignField: "_id",
                    as: "allUsers"
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    slug: 1,
                    rating: 1,
                    user: { $arrayElemAt: ["$allUsers", "$index"] },
                    createdAt: 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(ratingsData)),
        };
    } catch (error) {
        console.error("[GET_ALL_RATINGS]", error);
        return { success: false, message: "Failed to fetch ratings" };
    }
}

export async function deleteRating(params: {
    courseId: string;
    userId: string;
    path: string;
}) {
    try {
        await connectToDatabase();

        const course = await Course.findById(params.courseId);
        if (!course) {
            return { success: false, message: "Course not found" };
        }

        // Find the index of the user in ratedBy array
        const index = course.ratedBy.findIndex((id: any) => id.toString() === params.userId);

        if (index === -1) {
            return { success: false, message: "Rating not found" };
        }

        // Remove from both arrays
        course.rating.splice(index, 1);
        course.ratedBy.splice(index, 1);

        await course.save();
        revalidatePath(params.path);

        return { success: true, message: "Rating deleted successfully" };
    } catch (error) {
        console.error("[DELETE_RATING]", error);
        return { success: false, message: "Failed to delete rating" };
    }
}
