import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    startIndex: number;
    endIndex: number;
    onPageChange: (page: number) => void;
    itemLabel?: string; // e.g., "courses", "users", "orders"
}

export function Pagination({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPageChange,
    itemLabel = "items",
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const pages: (number | string)[] = [];

        for (let i = 1; i <= totalPages; i++) {
            const showPage =
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1);

            if (!showPage) {
                if (i === currentPage - 2 || i === currentPage + 2) {
                    if (!pages.includes("...")) {
                        pages.push("...");
                    }
                }
                continue;
            }

            pages.push(i);
        }

        return pages.map((page, index) => {
            if (page === "...") {
                return (
                    <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                        ...
                    </span>
                );
            }

            const pageNumber = page as number;
            return (
                <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNumber)}
                    className={
                        currentPage === pageNumber
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0"
                            : "border-gray-200 dark:border-gray-700"
                    }
                >
                    {pageNumber}
                </Button>
            );
        });
    };

    return (
        <Card className="border-2 border-gray-100 dark:border-gray-800">
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    <div className="text-sm text-muted-foreground">
                        Hiển thị{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {startIndex + 1}
                        </span>{" "}
                        đến{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {Math.min(endIndex, totalItems)}
                        </span>{" "}
                        trong tổng số{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {totalItems}
                        </span>{" "}
                        {itemLabel}
                    </div>


                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="border-gray-200 dark:border-gray-700"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1">Trước</span>
                        </Button>


                        <div className="flex items-center gap-1">{renderPageNumbers()}</div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="border-gray-200 dark:border-gray-700"
                        >
                            <span className="hidden sm:inline mr-1">Sau</span>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
