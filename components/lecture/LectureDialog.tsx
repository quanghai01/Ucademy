"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { createLecture, updateLecture } from "@/app/lib/actions/lecture.actions";
import { Lecture } from "@/app/types";


interface LectureDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseSlug: string;
    lecture?: (Lecture & { _id: string }) | null;
    onSuccess: () => void;
}

export default function LectureDialog({
    open,
    onOpenChange,
    courseSlug,
    lecture,
    onSuccess,
}: LectureDialogProps) {
    const [title, setTitle] = useState(lecture?.title || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Vui lòng nhập tên chương");
            return;
        }

        setLoading(true);

        try {
            let result;
            if (lecture) {
                // Update existing lecture
                result = await updateLecture({
                    lectureId: lecture._id,
                    title: title.trim(),
                });
            } else {
                // Create new lecture
                result = await createLecture({
                    courseSlug,
                    title: title.trim(),
                });
            }

            if (result.success) {
                toast.success(
                    lecture ? "Cập nhật chương thành công" : "Thêm chương thành công"
                );
                onSuccess();
                onOpenChange(false);
                setTitle("");
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {lecture ? "Cập nhật chương" : "Thêm chương mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {lecture
                            ? "Cập nhật thông tin chương học"
                            : "Tạo một chương học mới cho khóa học"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Tên chương <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Ví dụ: Chương 1: Giới thiệu"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
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
                            {loading ? "Đang xử lý..." : lecture ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
