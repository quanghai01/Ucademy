"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createLesson, updateLesson } from "@/app/lib/actions/lesson.actions";

import { ELessonType } from "@/app/types/enums";
import { Lesson } from "@/app/types";

interface LessonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseSlug: string;
    lectureId: string;
    lesson?: (Lesson & { _id: string }) | null;
    onSuccess: () => void;
}

export default function LessonDialog({
    open,
    onOpenChange,
    courseSlug,
    lectureId,
    lesson,
    onSuccess,
}: LessonDialogProps) {
    const [title, setTitle] = useState(lesson?.title || "");
    const [videoUrl, setVideoUrl] = useState(lesson?.video_url || "");
    const [content, setContent] = useState(lesson?.content || "");
    const [duration, setDuration] = useState(lesson?.duration?.toString() || "0");
    const [type, setType] = useState<ELessonType>(lesson?.type || ELessonType.VIDEO);
    const [loading, setLoading] = useState(false);

    // Reset form when lesson changes
    useEffect(() => {
        if (lesson) {
            setTitle(lesson.title);
            setVideoUrl(lesson.video_url || "");
            setContent(lesson.content || "");
            setDuration(lesson.duration?.toString() || "0");
            setType(lesson.type);
        } else {
            setTitle("");
            setVideoUrl("");
            setContent("");
            setDuration("0");
            setType(ELessonType.VIDEO);
        }
    }, [lesson, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Vui lòng nhập tên bài học");
            return;
        }

        setLoading(true);

        try {
            let result;
            if (lesson) {

                result = await updateLesson({
                    lessonId: lesson._id,
                    title: title.trim(),
                    video_url: videoUrl.trim(),
                    content: content.trim(),
                    duration: parseInt(duration) || 0,
                    type,
                });
            } else {

                result = await createLesson({
                    lectureId,
                    courseSlug,
                    title: title.trim(),
                    video_url: videoUrl.trim(),
                    content: content.trim(),
                    duration: parseInt(duration) || 0,
                    type,
                });
            }

            if (result.success) {
                toast.success(
                    lesson ? "Cập nhật bài học thành công" : "Thêm bài học thành công"
                );
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(result.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {lesson ? "Cập nhật bài học" : "Thêm bài học mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {lesson
                            ? "Cập nhật thông tin bài học"
                            : "Tạo một bài học mới cho chương này"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Tên bài học <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Ví dụ: Bài 1: Làm quen với React"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                                className="focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Loại bài học</Label>
                            <Select
                                value={type}
                                onValueChange={(value) => setType(value as ELessonType)}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ELessonType.VIDEO}>Video</SelectItem>
                                    <SelectItem value={ELessonType.TEXT}>Text</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {type === ELessonType.VIDEO && (
                            <div className="space-y-2">
                                <Label htmlFor="videoUrl">URL Video</Label>
                                <Input
                                    id="videoUrl"
                                    type="url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    disabled={loading}
                                    className="focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="duration">Thời lượng (giây)</Label>
                            <Input
                                id="duration"
                                type="number"
                                min="0"
                                placeholder="0"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                disabled={loading}
                                className="focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Nội dung</Label>
                            <Textarea
                                id="content"
                                placeholder="Nhập nội dung bài học (tùy chọn)"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                disabled={loading}
                                rows={4}
                                className="focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            {loading ? "Đang xử lý..." : lesson ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
