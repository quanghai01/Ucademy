"use client";

import { Clock, Edit, FileText, PlayCircle, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

import { ELessonType } from "@/app/types/enums";
import { Badge } from "../ui/badge";
import { Lesson } from "@/app/types";

interface LessonItemProps {
    lesson: Lesson & { _id: string };
    onEdit: (lesson: Lesson & { _id: string }) => void;
    onDelete: (lessonId: string) => void;
}

export default function LessonItem({ lesson, onEdit, onDelete }: LessonItemProps) {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const isVideo = lesson.type === ELessonType.VIDEO;

    return (
        <div className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 flex-1">

                <div className={`p-2 rounded-lg ${isVideo ? "bg-indigo-100 dark:bg-indigo-900/30" : "bg-gray-100 dark:bg-gray-700"}`}>
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
            </div>


            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(lesson)}
                    className="h-8 w-8 p-0"
                >
                    <Edit className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(lesson._id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
