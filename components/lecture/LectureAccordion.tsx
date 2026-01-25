"use client";

import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BookOpen,
    Edit,
    Plus,
    Trash2,
    Clock,
    GraduationCap,
} from "lucide-react";
import LessonItem from "../lesson/LessonItem";

import LessonDialog from "../lesson/LessonDialog";


import { deleteLecture } from "@/app/lib/actions/lecture.actions";
import { deleteLesson } from "@/app/lib/actions/lesson.actions";
import { toast } from "sonner";
import LectureDialog from "./LectureDialog";
import { Lecture, Lesson } from "@/app/types";

interface LectureAccordionProps {
    lectures: (Lecture & {
        _id: string;
        lessons: (Lesson & { _id: string })[];
    })[];
    courseSlug: string;
    onRefresh: () => void;
}

export default function LectureAccordion({
    lectures,
    courseSlug,
    onRefresh,
}: LectureAccordionProps) {
    const [lectureDialogOpen, setLectureDialogOpen] = useState(false);
    const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
    const [editingLecture, setEditingLecture] = useState<
        (Lecture & { _id: string }) | null
    >(null);
    const [editingLesson, setEditingLesson] = useState<
        (Lesson & { _id: string }) | null
    >(null);
    const [selectedLectureId, setSelectedLectureId] = useState<string>("");

    const handleAddLecture = () => {
        setEditingLecture(null);
        setLectureDialogOpen(true);
    };

    const handleEditLecture = (lecture: Lecture & { _id: string }) => {
        setEditingLecture(lecture);
        setLectureDialogOpen(true);
    };

    const handleDeleteLecture = async (lectureId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa chương này?")) return;

        const result = await deleteLecture(lectureId);
        if (result.success) {
            toast.success("Xóa chương thành công");
            onRefresh();
        } else {
            toast.error(result.message || "Có lỗi xảy ra");
        }
    };

    const handleAddLesson = (lectureId: string) => {
        setSelectedLectureId(lectureId);
        setEditingLesson(null);
        setLessonDialogOpen(true);
    };

    const handleEditLesson = (lesson: Lesson & { _id: string }) => {
        setSelectedLectureId(lesson.lecture.toString());
        setEditingLesson(lesson);
        setLessonDialogOpen(true);
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa bài học này?")) return;

        const result = await deleteLesson(lessonId);
        if (result.success) {
            toast.success("Xóa bài học thành công");
            onRefresh();
        } else {
            toast.error(result.message || "Có lỗi xảy ra");
        }
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

    if (lectures.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
                    <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Chưa có chương học nào
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Bắt đầu bằng cách thêm chương học đầu tiên cho khóa học của bạn
                </p>
                <Button
                    onClick={handleAddLecture}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm chương mới
                </Button>

                <LectureDialog
                    open={lectureDialogOpen}
                    onOpenChange={setLectureDialogOpen}
                    courseSlug={courseSlug}
                    lecture={editingLecture}
                    onSuccess={onRefresh}
                />
            </div>
        );
    }
    console.log("lecture", lectures)
    return (
        <div className="space-y-4">

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Nội dung khóa học
                    </h2>
                    <Badge variant="secondary">{lectures.length} chương</Badge>
                </div>
                <Button
                    onClick={handleAddLecture}
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm chương
                </Button>
            </div>


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


                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditLecture(lecture);
                                        }}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLecture(lecture._id);
                                        }}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-5 pb-4 pt-2">
                            <div className="space-y-3">
                                {lecture.lessons.length > 0 ? (
                                    <div className="space-y-2">
                                        {lecture.lessons.map((lesson) => (
                                            <LessonItem
                                                key={lesson._id.toString()}
                                                lesson={lesson}
                                                onEdit={handleEditLesson}
                                                onDelete={handleDeleteLesson}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                        <p className="text-gray-500 dark:text-gray-400 mb-3">
                                            Chương này chưa có bài học nào
                                        </p>
                                    </div>
                                )}

                                {/* Add Lesson button */}
                                <Button
                                    variant="outline"
                                    onClick={() => handleAddLesson(lecture._id)}
                                    className="w-full border-dashed border-2 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm bài học
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <LectureDialog
                open={lectureDialogOpen}
                onOpenChange={setLectureDialogOpen}
                courseSlug={courseSlug}
                lecture={editingLecture}
                onSuccess={onRefresh}
            />

            <LessonDialog
                open={lessonDialogOpen}
                onOpenChange={setLessonDialogOpen}
                courseSlug={courseSlug}
                lectureId={selectedLectureId}
                lesson={editingLesson}
                onSuccess={onRefresh}
            />
        </div>
    );
}
