import { ELessonType } from "@/app/types/enums";
import { HydratedDocument, model, models } from "mongoose";
import { Schema, Types } from "mongoose";

export interface ILesson {
  title: string;
  content: string;
  slug: string;
  lecture: Types.ObjectId;
  course: Types.ObjectId;
  order: number;
  duration: number;
  video_url: string;
  type: ELessonType;
  _destroy: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export type LessonDocument = HydratedDocument<ILesson>;

const lessonSchema = new Schema<LessonDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    video_url: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: Object.values(ELessonType),
      default: ELessonType.VIDEO,
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const Lesson = models.Lesson || model<LessonDocument>("Lesson", lessonSchema);
export default Lesson;
