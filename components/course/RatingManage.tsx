"use client";

import React, { useState, useMemo } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Search,
    Trash2,
    Star,
    User,
    BookOpen,
    Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { deleteRating } from "@/app/lib/actions/rating.actions";

interface RatingManageProps {
    ratings: any[];
}

const RatingManage = ({ ratings }: RatingManageProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const router = useRouter();

    const filteredRatings = useMemo(() => {
        return ratings.filter((r) => {
            const matchesSearch =
                r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [ratings, searchQuery]);

    const handleDelete = async (courseId: string, userId: string, ratingId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;

        setIsDeleting(ratingId);
        try {
            const res = await deleteRating({
                courseId,
                userId,
                path: "/manage/rating"
            });
            if (res.success) {
                toast.success("Xóa đánh giá thành công");
                router.refresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl blur-md opacity-75" />
                            <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                                <Star className="w-6 h-6 fill-current" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                            Quản Lý Đánh Giá
                        </h1>
                    </div>
                </div>
            </div>

            <Card className="border-2 border-gray-100 dark:border-gray-800">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên khóa học hoặc người dùng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-gray-200 dark:border-gray-700 focus:border-yellow-500"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {filteredRatings.length === 0 ? (
                    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <CardContent className="p-12 text-center">
                            <Star className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Không tìm thấy đánh giá nào
                            </h3>
                        </CardContent>
                    </Card>
                ) : (
                    filteredRatings.map((rating, idx) => {
                        const ratingId = `${rating._id}-${idx}`; // Combination ID for UI state
                        return (
                            <Card key={ratingId} className="group border-2 border-gray-100 dark:border-gray-800 hover:border-yellow-200 transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex gap-4">
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-yellow-100">
                                                <NextImage
                                                    src={rating.user?.avatar || "/default-avatar.png"}
                                                    alt={rating.user?.name || "User"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        {rating.user?.name || "Người dùng"}
                                                    </span>
                                                    <div className="flex items-center bg-yellow-400/10 text-yellow-600 px-2 py-0.5 rounded-full text-xs font-bold border border-yellow-200">
                                                        <Star className="w-3 h-3 fill-current mr-1" />
                                                        {rating.rating}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm text-indigo-600 font-medium">
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    <span>{rating.title}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    <span>Cách đây: {formatDistanceToNow(new Date(rating.createdAt), { addSuffix: false, locale: vi })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-red-200 text-red-600 hover:bg-red-50 md:self-center"
                                            onClick={() => handleDelete(rating._id, rating.user?._id, ratingId)}
                                            disabled={isDeleting === ratingId}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            {isDeleting === ratingId ? "Đang xóa..." : "Xóa đánh giá"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RatingManage;
