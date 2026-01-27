"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, BookOpen, Clock, Signal } from "lucide-react";
import { ICourse } from "@/database/course.model";
import LectureCurriculum from "@/components/lecture/LectureCurriculum";
import AddToCartButton from "./AddToCartButton";
import { getLevelConfig, formatDuration } from "@/app/lib/utils/course.utils";

export default function CourseDetail({ course }: { course: ICourse }) {
  const avgRating =
    course.rating.length > 0
      ? course.rating.reduce((a, b) => a + b, 0) / course.rating.length
      : 0;

  const totalLessons = course.lectures?.reduce((total, lecture: any) => {
    return total + (lecture.lessons?.length || 0);
  }, 0) || 0;

  const durationSeconds = course.totalDuration || course.lectures?.reduce((total, lecture: any) => {
    const lectureDuration = lecture.lessons?.reduce((sum: number, lesson: any) => {
      return sum + (lesson.duration || 0);
    }, 0) || 0;
    return total + lectureDuration;
  }, 0) || 0;

  const durationDisplay = formatDuration(durationSeconds);

  const extractVideoId = (url: string) => {
    try {
      // Handle watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.includes("v=")) {
        const videoId = url.split("v=")[1];
        return videoId.split("&")[0];
      }
      // Handle embed URLs: https://www.youtube.com/embed/VIDEO_ID
      if (url.includes("/embed/")) {
        const videoId = url.split("/embed/")[1];
        return videoId.split("&")[0].split("?")[0];
      }
      // Handle youtu.be short URLs: https://youtu.be/VIDEO_ID
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1];
        return videoId.split("&")[0].split("?")[0];
      }
      return null;
    } catch (error) {
      console.error("Error extracting video ID:", error);
      return null;
    }
  };

  const videoId = extractVideoId(course.intro_url);
  return (
    <div className="pb-20">
      <section className="h-[420px] my-2 relative">
        {course.intro_url ? (
          <iframe
            src={
              `https://www.youtube.com/embed/${videoId}`
            }
            className="w-full h-full"
            allowFullScreen
          />
        ) : (
          <Image
            src={course.image || "https://picsum.photos/1200/600"}
            alt={course.title}
            fill
            className="object-fill"
          />
        )}
        <div className="flex items-center gap-6 text-sm my-2">
          <Badge className="">{course.level}</Badge>
          {/* <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {course.author}
          </span> */}
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {course.views} học viên
          </span>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <div className="lg:col-span-8 space-y-10">
            <div className="w-full max-w-6xl space-y-4 mt-10">
              <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">
                {course.title}
              </h1>

              <p className="max-w-3xl">{course.desc}</p>
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">Thông tin</h2>
              <div className="flex flex-wrap gap-4 max-w-3xl">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>
                    <strong>{totalLessons}</strong> bài học
                  </span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{durationDisplay}</span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                  <Signal className="w-4 h-4 text-primary" />
                  <span>
                    {course.level === "BEGINNER"
                      ? "Cơ bản"
                      : course.level === "INTERMEDIATE"
                        ? "Trung cấp"
                        : "Nâng cao"}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
                  <Eye className="w-4 h-4 text-primary" />
                  <span>{course.views.toLocaleString()} lượt xem</span>
                </div>
              </div>
            </div>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Nội dung khóa học
                </h2>
              </div>
              <LectureCurriculum lectures={course.lectures as any} courseSlug={course.slug} />
            </section>


            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Bạn sẽ học được gì
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {course.info.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="group relative flex gap-4 p-5 rounded-2xl bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-100 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                      ✓
                    </div>
                    <span className="text-gray-700 leading-relaxed font-medium">{b}</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </section>


            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Yêu cầu
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {course.info.requirements.map((r, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 hover:from-amber-100 hover:to-orange-100 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/50 transition-all duration-300 hover:scale-105 cursor-default"
                  >
                    {r}
                  </Badge>
                ))}
              </div>
            </section>




            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Câu hỏi thường gặp
                </h2>
              </div>
              <div className="space-y-4">
                {course.info.qa.map((q, i) => (
                  <Card
                    key={i}
                    className="group border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br from-white to-emerald-50/20"
                  >
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-bold">
                          Q
                        </div>
                        <p className="font-semibold text-gray-800 text-lg">{q.question}</p>
                      </div>
                      <div className="flex items-start gap-3 pl-9">
                        <p className="text-gray-600 leading-relaxed">{q.answer}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>


          <div className="lg:col-span-4">
            <Card className="sticky top-24 rounded-2xl border-none bg-white/70 backdrop-blur shadow-xl">
              <CardContent className="p-6 space-y-6">

                <div>
                  <div className="flex items-end gap-3">
                    <span className="line-through text-muted-foreground text-sm">
                      {course.price}
                    </span>
                    <span className="text-4xl font-bold text-primary">
                      {course.sale_price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Truy cập trọn đời
                  </p>
                </div>


                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(avgRating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground">
                    ({course.rating.length} đánh giá)
                  </span>
                </div>


                <AddToCartButton
                  courseId={course._id.toString()}
                  courseName={course.title}
                  className="w-full h-12 rounded-xl text-white shadow-lg hover:scale-[1.02] transition"
                />

                <div className="text-sm space-y-2 text-muted-foreground">
                  <p>✔ Truy cập trọn đời</p>
                  <p>✔ Chứng chỉ hoàn thành</p>
                  <p>✔ Học mọi lúc, mọi nơi</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
