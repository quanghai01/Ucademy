import { getOrderByNumber } from "@/app/lib/actions/order.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: { orderNumber?: string };
}) {
    const { orderNumber } = searchParams;

    if (!orderNumber) {
        redirect("/");
    }

    const result = await getOrderByNumber(orderNumber);
    const order = result.data;

    return (
        <div className="container mx-auto px-4 py-16">
            <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>

                    <h1 className="text-3xl font-bold mb-4">
                        Thanh toán thành công! 🎉
                    </h1>

                    <p className="text-muted-foreground mb-6">
                        Cảm ơn bạn đã mua khóa học. Đơn hàng của bạn đã được xác nhận.
                    </p>

                    {order && (
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6 text-left">
                            <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
                            <div className="space-y-1 text-sm">
                                <p>
                                    <span className="text-muted-foreground">Mã đơn hàng:</span>{" "}
                                    <span className="font-mono">{order.orderNumber}</span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Tổng tiền:</span>{" "}
                                    <span className="font-bold text-emerald-600">
                                        {order.totalAmount.toLocaleString()}đ
                                    </span>
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Số khóa học:</span>{" "}
                                    {order.items.length}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 justify-center">
                        <Link href="/">
                            <Button variant="outline">Về trang chủ</Button>
                        </Link>
                        <Link href="/orders">
                            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                                Xem đơn hàng của tôi
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
