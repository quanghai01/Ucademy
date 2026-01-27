import { useState, useEffect, useMemo } from "react";

interface UsePaginationProps<T> {
    items: T[];
    itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
    currentPage: number;
    totalPages: number;
    paginatedItems: T[];
    startIndex: number;
    endIndex: number;
    setCurrentPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
}

export function usePagination<T>({
    items,
    itemsPerPage = 2,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
    const [currentPage, setCurrentPage] = useState(1);


    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;


    const paginatedItems = useMemo(() => {
        return items.slice(startIndex, endIndex);
    }, [items, startIndex, endIndex]);
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const nextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToPage = (page: number) => {
        const validPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(validPage);
    };

    return {
        currentPage,
        totalPages,
        paginatedItems,
        startIndex,
        endIndex,
        setCurrentPage,
        nextPage,
        prevPage,
        goToPage,
    };
}
