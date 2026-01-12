import { EUserRole, EUserStatus } from "@/app/types/enums";
import { model, models, Schema } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name?: string;
  username?: string | null;
  email: string;
  avatar?: string;
  courses: Schema.Types.ObjectId[];
  status: EUserStatus;
  role: EUserRole;
  createdAt: Date;
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
    timestamps: true, // ⭐ thay cho createAt
  }
);

const User = models.User || model("User", userSchema);

export default User;
