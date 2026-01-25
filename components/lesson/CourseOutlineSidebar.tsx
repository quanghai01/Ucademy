"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle, FileText, Check, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ELessonType } from "@/app/types/enums";

interface CourseOutlineSidebarProps {
    course: any;
    currentLessonSlug: string;
    courseSlug: string;
    completedLessons?: string[];
    progress?: number;
    totalLessons?: number;
    completedCount?: number;
}

export default function CourseOutlineSidebar({
    course,
    currentLessonSlug,
    courseSlug,
    completedLessons = [],
    progress = 0,
    totalLessons = 0,
    completedCount = 0,
}: CourseOutlineSidebarProps) {
    return (
        <Card className="sticky top-6 border-none shadow-lg">
            <CardHeader className="border-b">

                {progress !== undefined && totalLessons > 0 && (
                    <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                Tiến độ học tập
                            </span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                {progress}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {completedCount}/{totalLessons} bài đã hoàn thành
                        </p>
                    </div>
                )}

                <CardTitle className="text-lg flex items-center gap-2">
                    <span>Nội dung khóa học</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[calc(100vh-200px)] overflow-y-auto">
                <Accordion type="multiple" className="w-full">
                    {course.lectures?.map((lecture: any, lectureIndex: number) => (
                        <AccordionItem
                            key={lecture._id}
                            value={lecture._id}
                            className="border-b last:border-0"
                        >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800">
                                <div className="flex items-center gap-3 flex-1 text-left">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold flex-shrink-0">
                                        {lectureIndex + 1}
                                    </div>
                                    <span className="font-semibold text-sm line-clamp-2">
                                        {lecture.title}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-2">
                                <div className="space-y-1">
                                    {lecture.lessons?.map((lesson: any) => {
                                        const isCurrentLesson = lesson.slug === currentLessonSlug;
                                        const isVideo = lesson.type === ELessonType.VIDEO;

                                        return (
                                            <Link
                                                key={lesson._id}
                                                href={`/${courseSlug}/lessons/${lesson.slug}`}
                                                className={`block p-3 rounded-lg transition-colors ${isCurrentLesson
                                                    ? "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-600"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        {isVideo ? (
                                                            <PlayCircle
                                                                className={`w-4 h-4 ${isCurrentLesson
                                                                    ? "text-indigo-600 dark:text-indigo-400"
                                                                    : "text-gray-400"
                                                                    }`}
                                                            />
                                                        ) : (
                                                            <FileText
                                                                className={`w-4 h-4 ${isCurrentLesson
                                                                    ? "text-indigo-600 dark:text-indigo-400"
                                                                    : "text-gray-400"
                                                                    }`}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className={`text-sm font-medium line-clamp-2 ${isCurrentLesson
                                                                ? "text-indigo-600 dark:text-indigo-400"
                                                                : "text-gray-700 dark:text-gray-300"
                                                                }`}
                                                        >
                                                            {lesson.title}
                                                        </p>
                                                        {lesson.duration > 0 && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {Math.floor(lesson.duration / 60)}:
                                                                {String(lesson.duration % 60).padStart(2, "0")}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
