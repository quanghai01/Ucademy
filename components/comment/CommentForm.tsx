"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/app/lib/actions/comment.actions";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CommentFormProps {
    lessonId: string;
    userId: string;
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const CommentForm = ({
    lessonId,
    userId,
    parentId,
    onSuccess,
    onCancel,
}: CommentFormProps) => {
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsLoading(true);
        try {
            const res = await createComment({
                content,
                lessonId,
                userId,
                parentId,
                path: pathname,
            });

            if (res.success) {
                setContent("");
                toast.success("Đã đăng bình luận!");
                router.refresh();
                if (onSuccess) onSuccess();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                placeholder="Viết bình luận của bạn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                )}
                <Button type="submit" disabled={isLoading || !content.trim()}>
                    {isLoading ? "Đang gửi..." : "Đăng bình luận"}
                </Button>
            </div>
        </form>
    );
};

export default CommentForm;
