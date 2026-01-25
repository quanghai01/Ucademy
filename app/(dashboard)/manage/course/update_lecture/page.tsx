"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getLecturesByCourse } from "@/app/lib/actions/lecture.actions";
import { getCourseBySlug } from "@/app/lib/actions/course.actions";
import LectureAccordion from "@/components/lecture/LectureAccordion";
import Heading from "@/components/typography/Heading";
import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ICourse } from "@/database/course.model";
import { Lecture, Lesson } from "@/app/types";

export default function UpdateLecturePage() {
    const searchParams = useSearchParams();
    const courseSlug = searchParams.get("slug") || "";

    const [course, setCourse] = useState<ICourse | null>(null);
    const [lectures, setLectures] = useState<
        (Lecture)[]
    >([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {

            const courseData = await getCourseBySlug({ slug: courseSlug });
            setCourse(courseData);


            const lecturesResult = await getLecturesByCourse(courseSlug);
            if (lecturesResult.success) {
                setLectures(lecturesResult.data || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseSlug) {
            fetchData();
        }
    }, [courseSlug]);

    if (!courseSlug) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Không tìm thấy khóa học
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Vui lòng chọn một khóa học để quản lý
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-6 border-2 border-indigo-100 dark:border-indigo-900">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            <Badge variant="secondary" className="text-xs">
                                Quản lý nội dung
                            </Badge>
                        </div>
                        <Heading>{course?.title || "Khóa học"}</Heading>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                            {course?.desc || "Cập nhật nội dung và cấu trúc các chương học"}
                        </p>
                    </div>


                    <div className="flex items-center gap-4 ml-6">
                        <div className="text-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {lectures.length}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Chương</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-800">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {lectures.reduce((acc, lec) => acc + lec.lessons.length, 0)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Bài học</div>
                        </div>
                    </div>
                </div>
            </div>


            <LectureAccordion
                lectures={lectures}
                courseSlug={courseSlug}
                onRefresh={fetchData}
            />
        </div>
    );
}
