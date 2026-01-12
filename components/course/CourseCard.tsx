// components/course/course-card.tsx
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/app/types";
import { Award, Eye, Star, User } from "lucide-react";

interface CourseCardProps {
  course: Course;
}
function getLevelBadgeClass(level: string) {
  switch (level.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
}
export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-2">
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {course.isNew && (
          <Badge className="absolute left-3 top-3 bg-green-500 text-white px-2 py-1 text-xs rounded-full">
            NEW
          </Badge>
        )}
      </div>

      <CardHeader className="px-2 pt-3 pb-1 space-y-1">
        <CardTitle className="line-clamp-2 text-base font-semibold text-gray-900 dark:text-white">
          {course.title}
        </CardTitle>

        {course.level && (
          <Badge
            variant="secondary"
            className={`mt-1 px-2 py-1 text-xs rounded-full ${getLevelBadgeClass(
              course.level
            )}`}
          >
            {course.level}
          </Badge>
        )}

        {course.rating !== undefined && course.reviewCount !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(course.rating!)
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({course.reviewCount})
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="px-2 py-2 text-sm text-gray-600 dark:text-gray-300 space-y-2">
        {course.instructor && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>{course.instructor}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span>{course.followers.toLocaleString()}</span>
          </div>

          {course.price !== undefined && (
            <div className="font-semibold text-indigo-600 dark:text-indigo-400">
              {typeof course.price === "number"
                ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(course.price)
                : course.price}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-2 pb-4">
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button className="w-full bg-gradient-primary to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow duration-200">
            Xem chi tiết
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
