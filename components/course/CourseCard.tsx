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
import { Eye, Star, TrendingUp, Clock } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

function getLevelConfig(level: string) {
  switch (level.toLowerCase()) {
    case "beginner":
      return {
        bg: "bg-gradient-to-r from-emerald-500/90 to-teal-500/90",
        text: "text-white",
        label: "Cơ bản"
      };
    case "intermediate":
      return {
        bg: "bg-gradient-to-r from-amber-500/90 to-orange-500/90",
        text: "text-white",
        label: "Trung cấp"
      };
    case "advanced":
      return {
        bg: "bg-gradient-to-r from-rose-500/90 to-pink-500/90",
        text: "text-white",
        label: "Nâng cao"
      };
    default:
      return {
        bg: "bg-gradient-to-r from-gray-500/90 to-slate-500/90",
        text: "text-white",
        label: level
      };
  }
}

export default function CourseCard({ course }: CourseCardProps) {
  const levelConfig = getLevelConfig(course.level || "");
  const avgRating = course.rating || 0;
  const hasDiscount = course.sale_price && course.price && course.sale_price < course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.price! - course.sale_price!) / course.price!) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-lg hover:shadow-2xl hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/30 transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-gray-900">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={course.image || "https://picsum.photos/400/300?random=1"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Level Badge */}
        {course.level && (
          <Badge className={`absolute top-3 left-3 ${levelConfig.bg} ${levelConfig.text} px-3 py-1.5 text-xs font-semibold shadow-lg border-0`}>
            {levelConfig.label}
          </Badge>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 text-xs font-bold shadow-lg border-0 animate-pulse">
            -{discountPercent}%
          </Badge>
        )}

        {/* Views */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Eye className="w-3.5 h-3.5 text-white" />
          <span className="text-xs font-medium text-white">{course.views?.toLocaleString() || 0}</span>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="px-5 pt-4 pb-3 space-y-3">
        <CardTitle className="line-clamp-2 text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {course.title}
        </CardTitle>

        {/* Rating */}
        {avgRating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(avgRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                    }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {avgRating.toFixed(1)}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="px-5 py-3 space-y-3">
        {/* Author - if exists */}
        {course.author && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {course.author[0].toUpperCase()}
            </div>
            <span className="font-medium">{course.author}</span>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Truy cập trọn đời</span>
          </div>

          <div className="flex flex-col items-end">
            {hasDiscount ? (
              <>
                <span className="text-xs line-through text-gray-400 dark:text-gray-500">
                  {course.price?.toLocaleString()}đ
                </span>
                <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  {course.sale_price?.toLocaleString()}đ
                </span>
              </>
            ) : course.price ? (
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {course.price.toLocaleString()}đ
              </span>
            ) : (
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                Miễn phí
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-2">
        <Link href={`/course/${course.slug}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-indigo-300/50 dark:hover:shadow-indigo-900/50 transition-all duration-300 group-hover:scale-[1.02]">
            <span>Xem chi tiết</span>
            <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
