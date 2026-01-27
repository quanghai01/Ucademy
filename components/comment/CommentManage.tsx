"use client";

import React, { useState, useMemo } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Search,
    Filter,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    MessageSquare,
    User,
    BookOpen
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ECommentStatus } from "@/app/types/enums";
import { updateCommentStatus, deleteComment } from "@/app/lib/actions/comment.actions";

interface CommentManageProps {
    comments: any[];
}

const CommentManage = ({ comments }: CommentManageProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const router = useRouter();

    const filteredComments = useMemo(() => {
        return comments.filter((comment) => {
            const matchesSearch = comment.content
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
                comment.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === "all" || comment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [comments, searchQuery, statusFilter]);

    const handleStatusUpdate = async (commentId: string, status: ECommentStatus) => {
        setIsProcessing(commentId);
        try {
            const res = await updateCommentStatus({
                commentId,
                status,
                path: "/manage/comment"
            });
            if (res.success) {
                toast.success("Cập nhật trạng thái thành công");
                router.refresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsProcessing(null);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;

        setIsProcessing(commentId);
        try {
            const res = await deleteComment({
                commentId,
                path: "/manage/comment"
            });
            if (res.success) {
                toast.success("Xóa bình luận thành công");
                router.refresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setIsProcessing(null);
        }
    };

    const getStatusBadge = (status: ECommentStatus) => {
        switch (status) {
            case ECommentStatus.APPROVED:
                return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Đã duyệt</Badge>;
            case ECommentStatus.PENDING:
                return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Chờ duyệt</Badge>;
            case ECommentStatus.REJECTED:
                return <Badge className="bg-red-500/10 text-red-600 border-red-200">Bị từ chối</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-md opacity-75" />
                            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Quản Lý Bình Luận
                        </h1>
                    </div>
                </div>
            </div>

            <Card className="border-2 border-gray-100 dark:border-gray-800">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo nội dung hoặc người dùng..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-500"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px] border-gray-200 dark:border-gray-700">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Lọc theo trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value={ECommentStatus.APPROVED}>Đã duyệt</SelectItem>
                                <SelectItem value={ECommentStatus.PENDING}>Chờ duyệt</SelectItem>
                                <SelectItem value={ECommentStatus.REJECTED}>Bị từ chối</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {filteredComments.length === 0 ? (
                    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <CardContent className="p-12 text-center">
                            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Không tìm thấy bình luận nào
                            </h3>
                        </CardContent>
                    </Card>
                ) : (
                    filteredComments.map((comment) => (
                        <Card key={comment._id} className="group border-2 border-gray-100 dark:border-gray-800 hover:border-indigo-200 transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-3">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                                <NextImage
                                                    src={comment.user?.avatar || "/default-avatar.png"}
                                                    alt={comment.user?.name || "User"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 dark:text-white">{comment.user?.name}</span>
                                                    {getStatusBadge(comment.status)}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    <span>
                                                        {formatDistanceToNow(new Date(comment.createdAt), {
                                                            addSuffix: true,
                                                            locale: vi
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {comment.status !== ECommentStatus.APPROVED && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                                    onClick={() => handleStatusUpdate(comment._id, ECommentStatus.APPROVED)}
                                                    disabled={isProcessing === comment._id}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Duyệt
                                                </Button>
                                            )}
                                            {comment.status !== ECommentStatus.REJECTED && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                                    onClick={() => handleStatusUpdate(comment._id, ECommentStatus.REJECTED)}
                                                    disabled={isProcessing === comment._id}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Từ chối
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-gray-200 text-gray-600 hover:bg-gray-50"
                                                onClick={() => handleDelete(comment._id)}
                                                disabled={isProcessing === comment._id}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground px-1">
                                        <div className="flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span className="font-medium text-gray-600 dark:text-gray-400">Khóa học:</span>
                                            <span className="text-indigo-600 font-semibold">{comment.lesson?.course?.title}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            <span className="font-medium text-gray-600 dark:text-gray-400">Bài học:</span>
                                            <span>{comment.lesson?.title}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentManage;
