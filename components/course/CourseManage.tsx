"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    BookOpen,
    TrendingUp,
    FileText,
    Star,
    Users,
} from "lucide-react";

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
import { Course } from "@/app/types";
import { getLevelConfig } from "@/app/lib/utils/course.utils";
import { deleteCourse } from "@/app/lib/actions/course.actions";
import { usePagination } from "@/app/lib/hooks/usePagination";
import { Pagination } from "@/components/common/Pagination";




interface CourseManageProps {
    courses?: Course[];
}

const CourseManage = ({ courses }: CourseManageProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");
    const router = useRouter();

    const courseList = courses || [];


    const handleDeleteCourse = async (slug: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
            return;
        }

        try {
            const result = await deleteCourse(slug);
            if (result.success) {
                toast.success("Xóa khóa học thành công!");
                router.refresh();
            } else {
                toast.error(result.message || "Xóa khóa học thất bại");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Đã xảy ra lỗi";
            toast.error(message);
        }
    };


    const filteredCourses = useMemo(() => {
        return courseList.filter((course) => {
            const matchesSearch = course.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesLevel =
                levelFilter === "all" ||
                course.level?.toLowerCase() === levelFilter.toLowerCase();
            return matchesSearch && matchesLevel;
        });
    }, [courseList, searchQuery, levelFilter]);


    const {
        currentPage,
        totalPages,
        paginatedItems: paginatedCourses,
        startIndex,
        endIndex,
        goToPage,
    } = usePagination({
        items: filteredCourses,
        itemsPerPage: 2,
    });


    const stats = {
        total: courseList.length,
        published: courseList.filter((course) => course.status === "PUBLISHED").length,
        pending: courseList.filter((course) => course.status === "PENDING").length,
    };



    return (
        <div className="w-full space-y-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-md opacity-75" />
                            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                                <BookOpen className="w-6 h-6" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Quản Lý Khóa Học
                        </h1>
                    </div>
                    <p className="text-muted-foreground mt-2 ml-15">
                        Quản lý tất cả khóa học của bạn ở một nơi
                    </p>
                </div>

                <Link href="/manage/course/new">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-indigo-300/50 dark:hover:shadow-indigo-900/50 transition-all duration-300">
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo Khóa Học Mới
                    </Button>
                </Link>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2 border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Tổng Khóa Học
                                </p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Đã Xuất Bản
                                </p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1">
                                    {stats.published}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-amber-100 dark:border-amber-900/30 hover:border-amber-200 dark:hover:border-amber-800 transition-colors overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Bản Nháp
                                </p>
                                <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-1">
                                    {stats.pending}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-2 border-gray-100 dark:border-gray-800">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm khóa học..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-500"
                            />
                        </div>

                        <Select value={levelFilter} onValueChange={setLevelFilter}>
                            <SelectTrigger className="w-full md:w-[200px] border-gray-200 dark:border-gray-700">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Lọc theo cấp độ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả cấp độ</SelectItem>
                                <SelectItem value="beginner">Cơ bản</SelectItem>
                                <SelectItem value="intermediate">Trung bình</SelectItem>
                                <SelectItem value="advanced">Nâng cao</SelectItem>
                            </SelectContent>
                        </Select>

                        {(searchQuery || levelFilter !== "all") && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery("");
                                    setLevelFilter("all");
                                }}
                                className="border-gray-200 dark:border-gray-700"
                            >
                                Xóa bộ lọc
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>


            <div className="space-y-4">
                {filteredCourses.length === 0 ? (
                    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <CardContent className="p-12 text-center">
                            <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Không tìm thấy khóa học
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Thử thay đổi bộ lọc hoặc tạo khóa học mới
                            </p>
                            <Link href="/manage/course/new">
                                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo Khóa Học Mới
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    paginatedCourses.map((course) => {
                        const levelConfig = getLevelConfig(course.level);
                        const hasDiscount =
                            course.sale_price && course.price && course.sale_price < course.price;

                        return (
                            <Card
                                key={course.slug}
                                className="group border-2 border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg hover:shadow-indigo-100/50 dark:hover:shadow-indigo-900/20 transition-all duration-300"
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">

                                        <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                            <Image
                                                src={course.image || "/images/course-placeholder.png"}
                                                alt={course.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <Badge
                                                className={`absolute top-2 left-2 ${levelConfig.bg} ${levelConfig.text} px-2 py-1 text-xs font-semibold border-0`}
                                            >
                                                {levelConfig.label}
                                            </Badge>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {course.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                        {course.desc}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                                        {/* Rating */}
                                                        {course.rating && (
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                                    {course.rating}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* Views */}
                                                        <div className="flex items-center gap-1 text-muted-foreground">
                                                            <Users className="w-4 h-4" />
                                                            <span>
                                                                {course.views?.toLocaleString() || 0} lượt xem
                                                            </span>
                                                        </div>

                                                        {/* Author */}
                                                        {course.author && (
                                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                                <span>Giảng viên: {course.author}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Price & Actions */}
                                                <div className="flex md:flex-col items-center md:items-end gap-4">
                                                    <div className="flex flex-col items-end">
                                                        {hasDiscount ? (
                                                            <>
                                                                <span className="text-xs line-through text-gray-400">
                                                                    {course.price?.toLocaleString()}đ
                                                                </span>
                                                                <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                                                    {course.sale_price?.toLocaleString()}đ
                                                                </span>
                                                            </>
                                                        ) : course.price ? (
                                                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                                {course.price.toLocaleString()}đ
                                                            </span>
                                                        ) : (
                                                            <span className="text-xl font-bold text-emerald-600">
                                                                Miễn phí
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Link href={`/course/${course.slug}`}>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                                                                title="Xem chi tiết"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/manage/course/update?slug=${course.slug}`}>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-amber-200 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button onClick={() => handleDeleteCourse(course.slug)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                                                            title="Xóa khóa học"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCourses.length}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={goToPage}
                itemLabel="khóa học"
            />
        </div>
    );
};

export default CourseManage;