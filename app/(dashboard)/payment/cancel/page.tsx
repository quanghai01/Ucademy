import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage({
    searchParams,
}: {
    searchParams: { orderNumber?: string; error?: string; code?: string };
}) {
    const { error, code } = searchParams;

    let errorMessage = "Thanh toán không thành công";

    if (error === "invalid_signature") {
        errorMessage = "Giao dịch không hợp lệ";
    } else if (error === "process_failed") {
        errorMessage = "Không thể xử lý thanh toán";
    } else if (code && code !== "00") {
        errorMessage = "Thanh toán bị hủy hoặc thất bại";
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>

                    <h1 className="text-3xl font-bold mb-4">
                        {errorMessage}
                    </h1>

                    <p className="text-muted-foreground mb-6">
                        Đơn hàng của bạn chưa được thanh toán. Vui lòng thử lại.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link href="/cart">
                            <Button variant="outline">Quay lại giỏ hàng</Button>
                        </Link>
                        <Link href="/">
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                                Về trang chủ
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
