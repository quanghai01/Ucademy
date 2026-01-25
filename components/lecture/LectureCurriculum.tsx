"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Clock, PlayCircle, FileText } from "lucide-react";
import { ELessonType } from "@/app/types/enums";
import { Lecture, Lesson } from "@/app/types";
import Link from "next/link";



interface LectureCurriculumProps {
    lectures: Lecture[];
    courseSlug: string;
}

export default function LectureCurriculum({ lectures, courseSlug }: LectureCurriculumProps) {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const calculateTotalDuration = (lessons: Lesson[]) => {
        const total = lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);
        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    if (!lectures || lectures.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">
                    Chưa có nội dung khóa học
                </p>
            </div>
        );
    }

    return (
        <Accordion type="multiple" className="space-y-3">
            {lectures.map((lecture, index) => (
                <AccordionItem
                    key={lecture._id}
                    value={lecture._id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                        <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {lecture.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span>{lecture.lessons.length} bài học</span>
                                        {lecture.lessons.length > 0 && (
                                            <>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>{calculateTotalDuration(lecture.lessons)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-5 pb-4 pt-2">
                        <div className="space-y-2">
                            {lecture.lessons.length > 0 ? (
                                lecture.lessons.map((lesson) => {
                                    const isVideo = lesson.type === ELessonType.VIDEO;
                                    return (
                                        <Link
                                            key={lesson._id}
                                            href={`/${courseSlug}/lessons/${lesson.slug}`}
                                            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all duration-200 cursor-pointer"
                                        >
                                            <div
                                                className={`p-2 rounded-lg ${isVideo
                                                    ? "bg-indigo-100 dark:bg-indigo-900/30"
                                                    : "bg-gray-100 dark:bg-gray-700"
                                                    }`}
                                            >
                                                {isVideo ? (
                                                    <PlayCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                ) : (
                                                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                        {lesson.title}
                                                    </h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {isVideo ? "Video" : "Text"}
                                                    </Badge>
                                                </div>
                                                {lesson.duration > 0 && (
                                                    <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{formatDuration(lesson.duration)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                                    Chương này chưa có bài học nào
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
