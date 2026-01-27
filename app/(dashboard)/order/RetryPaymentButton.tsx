"use client";

import { useState } from "react";
import { createVNPayPayment } from "@/app/lib/actions/payment.actions";
import { toast } from "sonner";

interface RetryPaymentButtonProps {
    orderNumber: string;
    totalAmount: number;
    itemCount: number;
}

export default function RetryPaymentButton({
    orderNumber,
    totalAmount,
    itemCount,
}: RetryPaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleRetryPayment = async () => {
        setLoading(true);

        try {
            console.log("🔄 Retry payment for order:", orderNumber);

            const result = await createVNPayPayment({
                orderNumber,
                amount: totalAmount,
                orderInfo: `Tiep tuc thanh toan ${itemCount} khoa hoc`,
            });

            if (!result.success || !result.paymentUrl) {
                toast.error("Không thể tạo liên kết thanh toán");
                setLoading(false);
                return;
            }

            console.log("✅ Payment URL created, redirecting...");

            window.location.href = result.paymentUrl;
        } catch (error) {
            console.error("❌ Retry payment error:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
            setLoading(false);
        }
    };

    return (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                ⏳ Đơn hàng này đang chờ thanh toán
            </p>
            <button
                onClick={handleRetryPayment}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Đang xử lý..." : "Tiếp tục thanh toán"}
            </button>
        </div>
    );
}
