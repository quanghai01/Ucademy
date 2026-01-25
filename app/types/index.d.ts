import { ICourse } from "@/database/course.model";
import { ECourseLevel } from "./enums";

interface Item {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface ActiveLinkProps {
  item: Item;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  image: string;
  desc: string;
  price: number;
  sale_price: number;
  level: ECourseLevel;
  rating?: number;
  views?: number;
  author?: string;
  status: ECourseStatus;
}

interface TCreateCourseParams {
  title: string;
  slug: string;
  desc: string;
  price: number;
  sale_price?: number;
  level: ECourseLevel;
}

interface TCreateUserParams {
  clerkId: string;
  email: string;
  username?: string;
  name?: string;
  avatar?: string;
}

export interface Lesson {
  _id: string;
  title: string;
  content: string;
  slug: string;
  lecture: string;
  course: string;
  order: number;
  duration: number;
  video_url: string;
  type: ELessonType;
  _destroy: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  _id: string;
  title: string;
  lessons: Lesson[];
  course: string;
  order: number;
  _destroy: boolean;
  createdAt: string;
  updatedAt: string;
}
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T[K] extends object
  ? DeepPartial<T[K]>
  : T[K];
};
interface TUpdateCourseParams {
  slug: string;
  updateData: DeepPartial<ICourse>;
}

export {
  Item,
  ActiveLinkProps,
  Course,
  TCreateUserParams,
  TCreateCourseParams,
  TUpdateCourseParams,
  Lesson,
  Lecture
};
