"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { markLessonComplete } from "@/app/lib/actions/progress.actions";
import { useRouter } from "next/navigation";

interface MarkCompleteButtonProps {
    courseSlug: string;
    lessonId: string;
    isCompleted: boolean;
}

export default function MarkCompleteButton({
    courseSlug,
    lessonId,
    isCompleted: initialCompleted,
}: MarkCompleteButtonProps) {
    const [isCompleted, setIsCompleted] = useState(initialCompleted);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleMarkComplete = async () => {
        if (isCompleted) return; // Already completed

        startTransition(async () => {
            const result = await markLessonComplete({
                courseSlug,
                lessonId,
            });

            if (result.success) {
                setIsCompleted(true);
                // Refresh the page to update progress bar and checkmarks
                router.refresh();
            } else {
                console.error("Failed to mark complete:", result.message);
                alert("Không thể đánh dấu hoàn thành. Vui lòng thử lại!");
            }
        });
    };

    return (
        <Button
            onClick={handleMarkComplete}
            disabled={isCompleted || isPending}
            size="lg"
            className={`w-full sm:w-auto ${isCompleted
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                }`}
        >
            {isPending ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang lưu...
                </>
            ) : isCompleted ? (
                <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Đã hoàn thành
                </>
            ) : (
                <>
                    <Circle className="w-5 h-5 mr-2" />
                    Đánh dấu hoàn thành
                </>
            )}
        </Button>
    );
}
