import { EUserRole, EUserStatus } from "@/app/types/enums";
import { Document, model, models, Schema } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name?: string;
  username?: string;
  email: string;
  avatar?: string;
  courses: Schema.Types.ObjectId[];
  purchasedCourses: Schema.Types.ObjectId[];
  courseProgress: {
    course: Schema.Types.ObjectId;
    currentLesson: Schema.Types.ObjectId;
    lastAccessedAt: Date;
  }[];
  status: EUserStatus;
  role: EUserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
    },

    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    purchasedCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    courseProgress: [
      {
        course: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        currentLesson: {
          type: Schema.Types.ObjectId,
          ref: "Lesson",
          required: true,
        },
        lastAccessedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    role: {
      type: String,
      enum: Object.values(EUserRole),
      default: EUserRole.USER,
    },

    status: {
      type: String,
      enum: Object.values(EUserStatus),
      default: EUserStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model<IUser>("User", userSchema);
export default User;
