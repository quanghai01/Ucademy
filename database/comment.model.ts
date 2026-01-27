import { HydratedDocument, model, models, Schema, Types } from "mongoose";
import { ECommentStatus } from "@/app/types/enums";

export interface IComment {
    content: string;
    lesson: Types.ObjectId;
    user: Types.ObjectId;
    parentId?: Types.ObjectId;
    status: ECommentStatus;
    createdAt: Date;
    updatedAt: Date;
}

export type CommentDocument = HydratedDocument<IComment>;

const commentSchema = new Schema<CommentDocument>(
    {
        content: {
            type: String,
            required: true,
        },
        lesson: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        status: {
            type: String,
            enum: Object.values(ECommentStatus),
            default: ECommentStatus.APPROVED,
        },
    },
    {
        timestamps: true,
    }
);

const Comment = models.Comment || model<CommentDocument>("Comment", commentSchema);
export default Comment;
