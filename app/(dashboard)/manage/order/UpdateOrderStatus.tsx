"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/lib/actions/order.actions";
import { EOrderStatus } from "@/app/types/enums";
import { toast } from "sonner";

interface UpdateOrderStatusProps {
    orderNumber: string;
    currentStatus: EOrderStatus;
    onSuccess?: () => void;
}

export default function UpdateOrderStatus({
    orderNumber,
    currentStatus,
    onSuccess,
}: UpdateOrderStatusProps) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Available status transitions
    const getAvailableStatuses = () => {
        const statuses: { value: EOrderStatus; label: string; color: string }[] = [];

        if (currentStatus === EOrderStatus.PENDING) {
            statuses.push(
                { value: EOrderStatus.CANCELLED, label: "Hủy đơn", color: "text-gray-700" }
            );
        }

        if (currentStatus === EOrderStatus.PAID) {
            statuses.push(
                { value: EOrderStatus.REFUNDED, label: "Hoàn tiền", color: "text-purple-700" }
            );
        }

        return statuses;
    };

    const availableStatuses = getAvailableStatuses();

    const handleUpdateStatus = async (newStatus: EOrderStatus) => {
        if (!confirm(`Bạn có chắc muốn đổi trạng thái đơn hàng này thành "${availableStatuses.find(s => s.value === newStatus)?.label
            }"?`)) {
            return;
        }

        setLoading(true);

        try {
            const result = await updateOrderStatus(orderNumber, newStatus);

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

    // No actions available
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
                Cập nhật trạng thái
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
