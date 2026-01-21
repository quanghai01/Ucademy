import React from "react";

// Loading skeleton for course cards
export default function Loading() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="overflow-hidden rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg animate-pulse"
                >
                    {/* Image skeleton */}
                    <div className="h-48 w-full bg-gray-200 dark:bg-gray-700" />

                    {/* Content skeleton */}
                    <div className="p-5 space-y-3">
                        {/* Title */}
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200 dark:bg-gray-700" />

                        {/* Price */}
                        <div className="flex justify-between items-center">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                        </div>

                        {/* Button */}
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
