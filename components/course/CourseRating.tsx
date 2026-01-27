"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { rateCourse } from "@/app/lib/actions/course.actions";
import { Button } from "@/components/ui/button";

interface CourseRatingProps {
    courseId: string;
    userRating?: number;
}

export default function CourseRating({ courseId, userRating = 0 }: CourseRatingProps) {
    const [rating, setRating] = useState(userRating);
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (value: number) => {
        setIsSubmitting(true);
        try {
            const result = await rateCourse(courseId, value);
            if (result.success) {
                toast.success(result.message);
                setRating(value);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi đánh giá");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="flex flex-col items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Bạn thấy khóa học này thế nào?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hãy chia sẻ đánh giá của bạn để giúp chúng tôi cải thiện hơn nhé!
                </p>
            </div>

            <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={isSubmitting}
                        className={`transition-all duration-200 ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"
                            }`}
                        onMouseEnter={() => !isSubmitting && rating === 0 && setHover(star)}
                        onMouseLeave={() => !isSubmitting && rating === 0 && setHover(0)}
                        onClick={() => rating === 0 && handleSubmit(star)}
                    >
                        <Star
                            className={`w-10 h-10 ${star <= (hover || rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                                }`}
                        />
                    </button>
                ))}
            </div>

            <div className="text-center">
                {isSubmitting ? (
                    <span className="text-sm text-indigo-500 font-medium">Đang gửi đánh giá...</span>
                ) : rating > 0 ? (
                    <span className="text-sm text-emerald-500 font-medium">
                        Bạn đã đánh giá {rating} sao. Cảm ơn bạn!
                    </span>
                ) : null}
            </div>
        </div>
    );
}
