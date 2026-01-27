import { NextRequest, NextResponse } from "next/server";
import { verifyVNPaySignature, parseVNPayAmount } from "@/app/lib/utils/vnpay.utils";
import { processPaymentSuccess } from "@/app/lib/actions/order.actions";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Get all VNPay parameters
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        const secureHash = params.vnp_SecureHash;
        const hashSecret = process.env.VNPAY_HASH_SECRET || "";

        // Verify signature
        const isValid = verifyVNPaySignature(params, secureHash, hashSecret);

        if (!isValid) {
            console.error("[VNPay Callback] Invalid signature");
            return NextResponse.redirect(
                new URL("/payment/cancel?error=invalid_signature", request.url)
            );
        }

        const orderNumber = params.vnp_TxnRef;
        const responseCode = params.vnp_ResponseCode;
        const transactionId = params.vnp_TransactionNo;
        const bankCode = params.vnp_BankCode;
        const cardType = params.vnp_CardType;
        const amount = parseVNPayAmount(Number(params.vnp_Amount));

        // Check if payment successful
        if (responseCode === "00") {
            // Payment success
            const result = await processPaymentSuccess(orderNumber, {
                transactionId,
                bankCode,
                cardType,
            });

            if (result.success) {
                return NextResponse.redirect(
                    new URL(`/payment/success?orderNumber=${orderNumber}`, request.url)
                );
            } else {
                return NextResponse.redirect(
                    new URL(`/payment/cancel?error=process_failed`, request.url)
                );
            }
        } else {
            // Payment failed or cancelled
            return NextResponse.redirect(
                new URL(`/payment/cancel?orderNumber=${orderNumber}&code=${responseCode}`, request.url)
            );
        }
    } catch (error) {
        console.error("[VNPay Callback Error]", error);
        return NextResponse.redirect(
            new URL("/payment/cancel?error=server_error", request.url)
        );
    }
}
