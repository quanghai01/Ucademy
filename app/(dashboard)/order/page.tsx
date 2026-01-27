import React from "react";
import { getUserOrders } from "@/app/lib/actions/order.actions";
import { formatCurrency, getOrderStatusConfig } from "@/app/lib/utils/order.utils";
import { IOrder } from "@/database/order.model";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import RetryPaymentButton from "./RetryPaymentButton";

const UserOrderPage = async () => {
    const result = await getUserOrders();

    if (!result.success) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Đơn Hàng Của Tôi</h1>
                <p className="text-red-500">Không thể tải danh sách đơn hàng</p>
            </div>
        );
    }

    const orders: IOrder[] = result.data;

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Đơn Hàng Của Tôi</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Xem tất cả đơn hàng và trạng thái thanh toán của bạn
                </p>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Bạn chưa thực hiện đơn hàng nào
                    </p>
                    <Link
                        href="/explore"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Khám phá khóa học
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: any) => {
                        const statusConfig = getOrderStatusConfig(order.status);
                        const orderDate = new Date(order.createdAt);
                        const paymentDate = order.paymentInfo?.paymentDate
                            ? new Date(order.paymentInfo.paymentDate)
                            : null;

                        return (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">
                                                    {order.orderNumber}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                                                >
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                <span>Ngày đặt: </span>
                                                <span className="font-medium">
                                                    {format(orderDate, "dd/MM/yyyy HH:mm", { locale: vi })}
                                                </span>
                                                {paymentDate && (
                                                    <>
                                                        <span className="mx-2">•</span>
                                                        <span>Thanh toán: </span>
                                                        <span className="font-medium">
                                                            {format(paymentDate, "dd/MM/yyyy HH:mm", {
                                                                locale: vi,
                                                            })}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Tổng tiền
                                            </div>
                                            <div className="text-2xl font-bold text-primary">
                                                {formatCurrency(order.totalAmount)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <h4 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
                                        Khóa học ({order.items.length})
                                    </h4>
                                    <div className="space-y-3">
                                        {order.items.map((item: any, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <h5 className="font-medium mb-1">{item.title}</h5>
                                                    {item.course?.slug && order.status === "PAID" && (
                                                        <Link
                                                            href={`/${item.course.slug}`}
                                                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                                        >
                                                            <span>Vào học ngay</span>
                                                            <span>→</span>
                                                        </Link>
                                                    )}
                                                    {item.course?.slug && order.status !== "PAID" && (
                                                        <Link
                                                            href={`/${item.course.slug}`}
                                                            className="text-sm text-gray-500 hover:underline"
                                                        >
                                                            Xem chi tiết →
                                                        </Link>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    {item.salePrice && item.salePrice < item.price ? (
                                                        <div>
                                                            <div className="text-sm text-gray-500 line-through">
                                                                {formatCurrency(item.price)}
                                                            </div>
                                                            <div className="font-semibold text-primary">
                                                                {formatCurrency(item.salePrice)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="font-semibold">
                                                            {formatCurrency(item.price)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Info */}
                                {order.paymentInfo && (
                                    <div className="px-6 pb-6">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                            <h4 className="font-semibold mb-3 text-blue-900 dark:text-blue-300">
                                                Thông tin thanh toán
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <div className="text-gray-600 dark:text-gray-400 mb-1">
                                                        Phương thức
                                                    </div>
                                                    <div className="font-medium">
                                                        {order.paymentMethod}
                                                    </div>
                                                </div>
                                                {order.paymentInfo.transactionId && (
                                                    <div>
                                                        <div className="text-gray-600 dark:text-gray-400 mb-1">
                                                            Mã giao dịch
                                                        </div>
                                                        <div className="font-medium font-mono">
                                                            {order.paymentInfo.transactionId}
                                                        </div>
                                                    </div>
                                                )}
                                                {order.paymentInfo.bankCode && (
                                                    <div>
                                                        <div className="text-gray-600 dark:text-gray-400 mb-1">
                                                            Ngân hàng
                                                        </div>
                                                        <div className="font-medium">
                                                            {order.paymentInfo.bankCode}
                                                        </div>
                                                    </div>
                                                )}
                                                {order.paymentInfo.cardType && (
                                                    <div>
                                                        <div className="text-gray-600 dark:text-gray-400 mb-1">
                                                            Loại thẻ
                                                        </div>
                                                        <div className="font-medium">
                                                            {order.paymentInfo.cardType}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {order.status === "PENDING" && (
                                    <div className="px-6 pb-6">
                                        <RetryPaymentButton
                                            orderNumber={order.orderNumber}
                                            totalAmount={order.totalAmount}
                                            itemCount={order.items.length}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserOrderPage;
