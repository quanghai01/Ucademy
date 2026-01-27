"use client";

import { useState } from "react";
import { updateUserStatus } from "@/app/lib/actions/user.actions";
import { EUserStatus } from "@/app/types/enums";
import { toast } from "sonner";

interface UpdateUserStatusProps {
    userId: string;
    currentStatus: EUserStatus;
    onSuccess?: () => void;
}

export default function UpdateUserStatus({
    userId,
    currentStatus,
    onSuccess,
}: UpdateUserStatusProps) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const statusOptions = [
        { value: EUserStatus.ACTIVE, label: "Active", color: "text-emerald-700" },
        { value: EUserStatus.UNACTIVE, label: "Unactive", color: "text-gray-700" },
        { value: EUserStatus.BANNED, label: "Banned", color: "text-red-700" },
    ];

    const availableStatuses = statusOptions.filter(
        (status) => status.value !== currentStatus
    );

    const handleUpdateStatus = async (newStatus: EUserStatus) => {
        if (
            !confirm(
                `Bạn có chắc muốn đổi trạng thái user này thành "${statusOptions.find((s) => s.value === newStatus)?.label
                }"?`
            )
        ) {
            return;
        }

        setLoading(true);

        try {
            const result = await updateUserStatus(userId, newStatus);

            if (!result.success) {
                toast.error(result.message || "Không thể cập nhật trạng thái");
                setLoading(false);
                return;
            }

            toast.success("Cập nhật trạng thái thành công");
            setIsOpen(false);

            // Refresh page to show updated status
            window.location.reload();

            onSuccess?.();
        } catch (error) {
            console.error("❌ Update status error:", error);
            toast.error("Có lỗi xảy ra");
            setLoading(false);
        }
    };

    if (availableStatuses.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
                Đổi status
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                        <div className="p-2">
                            {availableStatuses.map((status) => (
                                <button
                                    key={status.value}
                                    onClick={() => handleUpdateStatus(status.value)}
                                    disabled={loading}
                                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${status.color} disabled:opacity-50`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
