import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface ILecture {
  title: string;
  lessons: Types.ObjectId[];
  course: Types.ObjectId;
  order: number;
  _destroy: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export type LectureDocument = HydratedDocument<ILecture>;

const lectureSchema = new Schema<LectureDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

lectureSchema.index({ course: 1, _destroy: 1, order: 1 });
lectureSchema.index({ _destroy: 1, order: 1 });

const Lecture =
  models.Lecture || model<LectureDocument>("Lecture", lectureSchema);
export default Lecture;
