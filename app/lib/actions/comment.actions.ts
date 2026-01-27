"use server";

import Comment from "@/database/comment.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import { ECommentStatus } from "@/app/types/enums";

export async function createComment(params: {
    content: string;
    lessonId: string;
    userId: string;
    parentId?: string;
    path: string;
}) {
    try {
        await connectToDatabase();

        const newComment = await Comment.create({
            content: params.content,
            lesson: params.lessonId,
            user: params.userId,
            parentId: params.parentId || null,
            status: ECommentStatus.APPROVED,
        });

        revalidatePath(params.path);

        return {
            success: true,
            data: JSON.parse(JSON.stringify(newComment)),
        };
    } catch (error) {
        console.error("[CREATE_COMMENT]", error);
        return { success: false, message: "Failed to create comment" };
    }
}

export async function getCommentsByLesson(lessonId: string) {
    try {
        await connectToDatabase();

        const comments = await Comment.find({
            lesson: lessonId,
            status: ECommentStatus.APPROVED
        })
            .populate("user", "name avatar clerkId")
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(comments)),
        };
    } catch (error) {
        console.error("[GET_COMMENTS_BY_LESSON]", error);
        return { success: false, message: "Failed to fetch comments" };
    }
}

export async function deleteComment(params: {
    commentId: string;
    path: string;
}) {
    try {
        await connectToDatabase();

        const deletedComment = await Comment.findByIdAndDelete(params.commentId);

        if (!deletedComment) {
            return { success: false, message: "Comment not found" };
        }

        revalidatePath(params.path);

        return { success: true, message: "Comment deleted successfully" };
    } catch (error) {
        console.error("[DELETE_COMMENT]", error);
        return { success: false, message: "Failed to delete comment" };
    }
}

export async function updateCommentStatus(params: {
    commentId: string;
    status: ECommentStatus;
    path: string;
}) {
    try {
        await connectToDatabase();

        const updatedComment = await Comment.findByIdAndUpdate(
            params.commentId,
            { status: params.status },
            { new: true }
        );

        if (!updatedComment) {
            return { success: false, message: "Comment not found" };
        }

        revalidatePath(params.path);

        return { success: true, message: "Comment status updated successfully" };
    } catch (error) {
        console.error("[UPDATE_COMMENT_STATUS]", error);
        return { success: false, message: "Failed to update comment status" };
    }
}
export async function getAllComments() {
    try {
        await connectToDatabase();

        const comments = await Comment.find()
            .populate({
                path: "lesson",
                select: "title slug",
                populate: {
                    path: "course",
                    select: "title slug",
                },
            })
            .populate("user", "name avatar clerkId")
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(comments)),
        };
    } catch (error) {
        console.error("[GET_ALL_COMMENTS]", error);
        return { success: false, message: "Failed to fetch comments" };
    }
}
