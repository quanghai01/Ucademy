import { EOrderStatus } from "@/app/types/enums";

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-XXXXXX (random 6 digits)
 */
export function generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${dateStr}-${random}`;
}

/**
 * Get order status badge configuration
 */
export function getOrderStatusConfig(status: EOrderStatus) {
    const configs = {
        [EOrderStatus.PENDING]: {
            label: "Chờ thanh toán",
            bg: "bg-amber-100 dark:bg-amber-900/30",
            text: "text-amber-700 dark:text-amber-400",
            border: "border-amber-200 dark:border-amber-800",
        },
        [EOrderStatus.PAID]: {
            label: "Đã thanh toán",
            bg: "bg-emerald-100 dark:bg-emerald-900/30",
            text: "text-emerald-700 dark:text-emerald-400",
            border: "border-emerald-200 dark:border-emerald-800",
        },
        [EOrderStatus.CANCELLED]: {
            label: "Đã hủy",
            bg: "bg-gray-100 dark:bg-gray-900/30",
            text: "text-gray-700 dark:text-gray-400",
            border: "border-gray-200 dark:border-gray-800",
        },
        [EOrderStatus.REFUNDED]: {
            label: "Đã hoàn tiền",
            bg: "bg-purple-100 dark:bg-purple-900/30",
            text: "text-purple-700 dark:text-purple-400",
            border: "border-purple-200 dark:border-purple-800",
        },
    };

    return configs[status] || configs[EOrderStatus.PENDING];
}

/**
 * Format currency to VND
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

/**
 * Calculate order total from items
 */
export function calculateOrderTotal(
    items: Array<{ price: number; salePrice?: number }>
): number {
    return items.reduce((total, item) => {
        const price = item.salePrice || item.price;
        return total + price;
    }, 0);
}
