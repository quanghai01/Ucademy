import React from "react";
import { getAllOrders } from "@/app/lib/actions/order.actions";
import { formatCurrency, getOrderStatusConfig } from "@/app/lib/utils/order.utils";
import { IOrder } from "@/database/order.model";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import UpdateOrderStatus from "./UpdateOrderStatus";


const AdminOrderPage = async () => {
  const orders: IOrder[] = await getAllOrders();

  // Calculate statistics
  const stats = {
    total: orders.length,
    paid: orders.filter((o: any) => o.status === "PAID").length,
    pending: orders.filter((o: any) => o.status === "PENDING").length,
    cancelled: orders.filter((o: any) => o.status === "CANCELLED").length,
    revenue: orders
      .filter((o: any) => o.status === "PAID")
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quản Lý Đơn Hàng</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý tất cả đơn hàng của người dùng
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Tổng đơn hàng
          </div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800">
          <div className="text-sm text-emerald-700 dark:text-emerald-400 mb-2">
            Đã thanh toán
          </div>
          <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
            {stats.paid}
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
          <div className="text-sm text-amber-700 dark:text-amber-400 mb-2">
            Chờ thanh toán
          </div>
          <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">
            {stats.pending}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Đã hủy
          </div>
          <div className="text-3xl font-bold text-gray-700 dark:text-gray-400">
            {stats.cancelled}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-700 dark:text-blue-400 mb-2">
            Doanh thu
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {formatCurrency(stats.revenue)}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Chưa có đơn hàng nào trong hệ thống
          </p>
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
                    <div className="flex-1">
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
                      {/* User Info */}
                      {order.user && (
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Khách hàng:
                          </span>
                          <span className="font-medium">
                            {order.user.name || order.user.email}
                          </span>
                          <span className="text-gray-500">
                            ({order.user.email})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-3 mb-2">
                        <UpdateOrderStatus
                          orderNumber={order.orderNumber}
                          currentStatus={order.status}
                        />
                      </div>
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
                          {item.course?.slug && (
                            <Link
                              href={`/${item.course.slug}`}
                              className="text-sm text-primary hover:underline"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrderPage;
