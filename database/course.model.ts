import { HydratedDocument, model, models, Schema, Types } from "mongoose";

import { ECourseLevel, ECourseStatus } from "@/app/types/enums";
import slugify from "slugify";
export interface ICourse {
  _id: string;
  title: string;
  image: string;
  intro_url: string;
  desc: string;
  price: number;
  sale_price: number;
  slug: string;
  status: ECourseStatus;
  createdAt: Date;
  author: Schema.Types.ObjectId | string;
  level: ECourseLevel;
  views: number;
  rating: number[];
  info: {
    requirements: string[];
    benefits: string[];
    qa: { question: string; answer: string }[];
  };
  lectures: Schema.Types.ObjectId[];
  totalDuration?: number;
  ratedBy: Types.ObjectId[];
  _destroy: boolean;
}
export type CourseDocument = HydratedDocument<ICourse>;

const courseSchema = new Schema<CourseDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    intro_url: {
      type: String,
      default: "",
    },

    desc: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    sale_price: {
      type: Number,
      default: 0,
      min: 0,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(ECourseStatus),
      default: ECourseStatus.PENDING,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    level: {
      type: String,
      enum: Object.values(ECourseLevel),
      default: ECourseLevel.BEGINNER,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: [Number],
      default: [],
    },
    ratedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    info: {
      requirements: {
        type: [String],
        default: [],
      },
      benefits: {
        type: [String],
        default: [],
      },
      qa: [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
        },
      ],
    },

    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    _destroy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


courseSchema.index({ _destroy: 1, status: 1, createdAt: -1 });
courseSchema.index({ author: 1, _destroy: 1 });
courseSchema.index({ slug: 1, _destroy: 1 });

courseSchema.pre<ICourse>("save", async function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

// Virtual: average rating

courseSchema.virtual("avgRating").get(function (this: ICourse) {
  if (!this.rating || this.rating.length === 0) return 0;
  const sum = this.rating.reduce((acc, r) => acc + r, 0);
  return Math.round((sum / this.rating.length) * 10) / 10; // 1 decimal
});

// Method: add a rating

courseSchema.methods.addRating = async function (
  this: CourseDocument,
  value: number,
  userId: string
) {
  if (value < 1 || value > 5) throw new Error("Rating must be 1-5");
  const userObjectId = new Types.ObjectId(userId);
  if (this.ratedBy.some((id: any) => id.toString() === userId)) {
    throw new Error("User already rated this course");
  }
  this.rating.push(value);
  this.ratedBy.push(userObjectId as any);
  return this.save();
};

const Course = models.Course || model<CourseDocument>("Course", courseSchema);
export default Course;
