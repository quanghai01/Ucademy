import { Document, model, models, Schema } from "mongoose";

export interface IProgress extends Document {
    user: string;
    course: Schema.Types.ObjectId;
    lesson: Schema.Types.ObjectId;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
    {
        user: {
            type: String,
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        lesson: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            required: true,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);


progressSchema.index({ user: 1, lesson: 1 }, { unique: true });

progressSchema.index({ user: 1, course: 1 });

const Progress = models.Progress || model<IProgress>("Progress", progressSchema);
export default Progress;
