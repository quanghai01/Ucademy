"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { deleteComment } from "@/app/lib/actions/comment.actions";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CommentForm from "./CommentForm";

interface CommentItemProps {
    comment: any;
    userId: string;
    clerkId: string;
    lessonId: string;
    isAdmin: boolean;
    replies?: any[];
}

const CommentItem = ({
    comment,
    userId,
    clerkId,
    lessonId,
    isAdmin,
    replies = [],
}: CommentItemProps) => {
    const [isReplying, setIsReplying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const isOwner = comment.user?.clerkId === clerkId;

    const handleDelete = async () => {
        if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

        setIsDeleting(true);
        try {
            const res = await deleteComment({
                commentId: comment._id,
                path: pathname,
            });

            if (res.success) {
                toast.success("Đã xóa bình luận");
                router.refresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="relative h-10 w-10 shrink-0">
                    <Image
                        src={comment.user?.avatar || "/default-avatar.png"}
                        alt={comment.user?.name || "User"}
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                            {comment.user?.name || "Người dùng"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-1">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Trả lời
                        </button>
                        {(isOwner || isAdmin) && (
                            <button
                                disabled={isDeleting}
                                onClick={handleDelete}
                                className="text-xs font-medium text-destructive hover:opacity-80 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Đang xóa..." : "Xóa"}
                            </button>
                        )}
                    </div>

                    {isReplying && (
                        <div className="mt-4">
                            <CommentForm
                                lessonId={lessonId}
                                userId={userId}
                                parentId={comment._id}
                                onSuccess={() => setIsReplying(false)}
                                onCancel={() => setIsReplying(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {replies.length > 0 && (
                <div className="ml-14 flex flex-col gap-6 mt-2 border-l-2 border-muted pl-4">
                    {replies.map((reply: any) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            userId={userId}
                            clerkId={clerkId}
                            lessonId={lessonId}
                            isAdmin={isAdmin}
                            replies={reply.repliesList}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;
