"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, PlayCircle, FileText, BookOpen } from "lucide-react";
import { ELessonType } from "@/app/types/enums";
import LessonNavigation from "./LessonNavigation";
import CourseOutlineSidebar from "./CourseOutlineSidebar";
import MarkCompleteButton from "./MarkCompleteButton";
import CourseRating from "../course/CourseRating";

import CommentSection from "../comment/CommentSection";

interface LessonDetailProps {
    lesson: any;
    course: any;
    courseSlug: string;
    courseId: string;
    userId: string;
    clerkId: string;
    isAdmin: boolean;
    comments: any[];
    userRating?: number;
    completedLessons?: string[];
    progress?: number;
    totalLessons?: number;
    completedCount?: number;
}

export default function LessonDetail({
    lesson,
    course,
    courseSlug,
    courseId,
    userId,
    clerkId,
    isAdmin,
    comments,
    userRating,
    completedLessons,
    progress,
    totalLessons,
    completedCount
}: LessonDetailProps) {
    const isVideo = lesson.type === ELessonType.VIDEO;

    const extractVideoId = (url: string) => {
        try {
            if (url.includes("v=")) {
                const videoId = url.split("v=")[1];
                return videoId.split("&")[0];
            }
            if (url.includes("/embed/")) {
                const videoId = url.split("/embed/")[1];
                return videoId.split("&")[0].split("?")[0];
            }
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

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;

        if (hours > 0) {
            return `${hours}h ${remainingMins}m`;
        }
        return `${mins}m`;
    };

    const videoId = lesson.video_url ? extractVideoId(lesson.video_url) : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <div className="lg:col-span-8 space-y-6">

                        <Card className="overflow-hidden border-none shadow-lg">
                            <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                                {isVideo && videoId ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        className="absolute top-0 left-0 w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                ) : (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                                        {isVideo ? (
                                            <PlayCircle className="w-24 h-24 text-white opacity-50" />
                                        ) : (
                                            <FileText className="w-24 h-24 text-white opacity-50" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>


                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge variant="outline" className="text-xs">
                                                {isVideo ? "Video" : "Văn bản"}
                                            </Badge>
                                            {lesson.duration > 0 && (
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatDuration(lesson.duration)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {lesson.title}
                                        </h1>
                                    </div>
                                </div>


                                {lesson.content && (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <div
                                            className="text-gray-700 dark:text-gray-300 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>


                        <div className="mt-6">
                            <MarkCompleteButton
                                courseSlug={courseSlug}
                                lessonId={lesson._id}
                                isCompleted={completedLessons?.includes(lesson._id.toString()) || false}
                            />
                        </div>


                        <LessonNavigation
                            currentLessonSlug={lesson.slug}
                            course={course}
                            courseSlug={courseSlug}
                        />

                        <div className="mt-10">
                            <CourseRating courseId={courseId} userRating={userRating} />
                        </div>

                        <CommentSection
                            lessonId={lesson._id}
                            userId={userId}
                            clerkId={clerkId}
                            isAdmin={isAdmin}
                            comments={comments}
                        />
                    </div>


                    <div className="lg:col-span-4">
                        <CourseOutlineSidebar
                            course={course}
                            currentLessonSlug={lesson.slug}
                            courseSlug={courseSlug}
                            completedLessons={completedLessons}
                            progress={progress}
                            totalLessons={totalLessons}
                            completedCount={completedCount}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
