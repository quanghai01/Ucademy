"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LessonNavigationProps {
    currentLessonSlug: string;
    course: any;
    courseSlug: string;
}

export default function LessonNavigation({
    currentLessonSlug,
    course,
    courseSlug,
}: LessonNavigationProps) {

    const allLessons: any[] = [];
    course.lectures?.forEach((lecture: any) => {
        lecture.lessons?.forEach((lesson: any) => {
            allLessons.push(lesson);
        });
    });


    const currentIndex = allLessons.findIndex(
        (lesson) => lesson.slug === currentLessonSlug
    );

    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson =
        currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    return (
        <div className="flex items-center justify-between gap-4">

            {prevLesson ? (
                <Link
                    href={`/${courseSlug}/lessons/${prevLesson.slug}`}
                    className="flex-1"
                >
                    <Button
                        variant="outline"
                        className="w-full justify-end gap-2 h-auto py-4 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                        <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                        <div className="text-left flex-1 min-w-0">
                            <p className="text-xs text-white/80 mb-1">Bài trước</p>
                            <p className="font-semibold truncate ">{prevLesson.title}</p>
                        </div>
                    </Button>
                </Link>
            ) : (
                <div className="flex-1" />
            )}


            {nextLesson ? (
                <Link
                    href={`/${courseSlug}/lessons/${nextLesson.slug}`}
                    className="flex-1"
                >
                    <Button
                        variant="outline"
                        className="w-full justify-end gap-2 h-auto py-4 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                        <div className="text-right flex-1 min-w-0 ">
                            <p className="text-xs text-white/80 mb-1">Bài tiếp theo</p>
                            <p className="font-semibold truncate ">{nextLesson.title}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 flex-shrink-0" />
                    </Button>
                </Link>
            ) : (
                <div className="flex-1" />
            )}
        </div>
    );
}
