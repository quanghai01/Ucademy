"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingCart } from "lucide-react";
import { removeFromCart } from "@/app/lib/actions/cart.actions";
import { createOrder } from "@/app/lib/actions/order.actions";
import { createVNPayPayment } from "@/app/lib/actions/payment.actions";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPageClient({ cart }: { cart: any }) {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const router = useRouter();

    const handleRemove = async (courseId: string) => {
        const result = await removeFromCart(courseId);
        if (result.success) {
            toast.success("Đã xóa khỏi giỏ hàng");
            router.refresh();
        } else {
            toast.error("Không thể xóa");
        }
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);

        try {
            // Create order
            const items = cart.items.map((item: any) => ({
                course: item.course._id,
                title: item.course.title,
                price: item.price,
                salePrice: item.salePrice,
            }));

            const orderResult = await createOrder(items);

            if (!orderResult.success || !orderResult.data) {
                toast.error("Không thể tạo đơn hàng");
                return;
            }

            const order = orderResult.data;

            // Create VNPay payment URL
            const paymentResult = await createVNPayPayment({
                orderNumber: order.orderNumber,
                amount: order.totalAmount,
                orderInfo: `Thanh toan don hang ${order.orderNumber}`,
            });

            if (paymentResult.success && paymentResult.paymentUrl) {
                // Redirect to VNPay
                window.location.href = paymentResult.paymentUrl;
            } else {
                toast.error("Không thể tạo link thanh toán");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setIsCheckingOut(false);
        }
    };

    const total = cart.items.reduce((sum: number, item: any) => {
        return sum + (item.salePrice || item.price);
    }, 0);

    if (cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto text-center p-8">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold mb-2">Giỏ hàng trống</h2>
                    <p className="text-muted-foreground mb-4">
                        Bạn chưa có khóa học nào trong giỏ hàng
                    </p>
                    <Link href="/">
                        <Button>Khám phá khóa học</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item: any) => (
                        <Card key={item.course._id}>
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden">
                                        <Image
                                            src={item.course.image || "/placeholder.png"}
                                            alt={item.course.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.course.title}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            {item.salePrice && item.salePrice < item.price ? (
                                                <>
                                                    <span className="text-lg font-bold text-red-600">
                                                        {item.salePrice.toLocaleString()}đ
                                                    </span>
                                                    <span className="text-sm text-gray-400 line-through">
                                                        {item.price.toLocaleString()}đ
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-bold">
                                                    {item.price.toLocaleString()}đ
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemove(item.course._id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div>
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-4">Tổng đơn hàng</h2>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Số lượng: {cart.items.length} khóa học
                                    </span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                                    <span>Tổng cộng:</span>
                                    <span className="text-indigo-600">
                                        {total.toLocaleString()}đ
                                    </span>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                size="lg"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? "Đang xử lý..." : "Thanh toán"}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Thanh toán an toàn qua VNPay
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
