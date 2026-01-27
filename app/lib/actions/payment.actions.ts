"use server";

import { generateVNPayUrl } from "../utils/vnpay.utils";

/**
 * Create VNPay payment URL
 */
export async function createVNPayPayment(params: {
    orderNumber: string;
    amount: number;
    orderInfo: string;
}) {
    try {
        const { orderNumber, amount, orderInfo } = params;

        const vnpUrl = generateVNPayUrl({
            amount,
            orderNumber,
            orderInfo,
            ipAddr: "127.0.0.1", // In production, get from request headers
            returnUrl: process.env.VNPAY_RETURN_URL || "http://localhost:3000/api/payment/vnpay/callback",
            tmnCode: process.env.VNPAY_TMN_CODE || "",
            hashSecret: process.env.VNPAY_HASH_SECRET || "",
            vnpUrl: process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
        });

        return {
            success: true,
            paymentUrl: vnpUrl,
        };
    } catch (error) {
        console.error("[createVNPayPayment]", error);
        return {
            success: false,
            message: "Failed to create payment URL",
        };
    }
}
