"use server";

import Order from "@/database/order.model";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { auth } from "@clerk/nextjs/server";
import { EOrderStatus, EPaymentMethod } from "@/app/types/enums";
import { generateOrderNumber } from "../utils/order.utils";
import { clearCart } from "./cart.actions";

/**
 * Create order from cart items
 */
export async function createOrder(items: Array<{
    course: string;
    title: string;
    price: number;
    salePrice?: number;
}>) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        await connectToDatabase();

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const totalAmount = items.reduce((sum, item) => {
            return sum + (item.salePrice || item.price);
        }, 0);

        const order = await Order.create({
            orderNumber: generateOrderNumber(),
            user: user._id,
            items,
            totalAmount,
            status: EOrderStatus.PENDING,
            paymentMethod: EPaymentMethod.VNPAY,
        });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(order)),
        };
    } catch (error) {
        console.error("[createOrder]", error);
        return { success: false, message: "Failed to create order" };
    }
}

/**
 * Get order by order number
 */
export async function getOrderByNumber(orderNumber: string) {
    try {
        await connectToDatabase();

        const order = await Order.findOne({ orderNumber })
            .populate("user", "name email")
            .populate("items.course")
            .lean();

        if (!order) {
            return { success: false, message: "Order not found" };
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(order)),
        };
    } catch (error) {
        console.error("[getOrderByNumber]", error);
        return { success: false, message: "Failed to get order" };
    }
}

/**
 * Get user's orders
 */
export async function getUserOrders() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        await connectToDatabase();

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const orders = await Order.find({ user: user._id })
            .populate("items.course", "title image slug")
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(orders)),
        };
    } catch (error) {
        console.error("[getUserOrders]", error);
        return { success: false, message: "Failed to get orders" };
    }
}

/**
 * Get all orders (Admin)
 */
export async function getAllOrders() {
    try {
        await connectToDatabase();

        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.course", "title")
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.error("[getAllOrders]", error);
        return [];
    }
}

/**
 * Update order status and grant course access
 */
export async function updateOrderStatus(orderNumber: string, status: EOrderStatus) {
    try {
        await connectToDatabase();

        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return { success: false, message: "Order not found" };
        }

        order.status = status;

        // If paid, grant course access
        if (status === EOrderStatus.PAID) {
            const courseIds = order.items.map((item: any) => item.course);

            await User.findByIdAndUpdate(order.user, {
                $addToSet: { purchasedCourses: { $each: courseIds } },
            });
        }

        await order.save();

        return {
            success: true,
            message: "Order updated successfully",
            data: JSON.parse(JSON.stringify(order)),
        };
    } catch (error) {
        console.error("[updateOrderStatus]", error);
        return { success: false, message: "Failed to update order" };
    }
}

/**
 * Process successful payment
 */
export async function processPaymentSuccess(orderNumber: string, paymentInfo: {
    transactionId: string;
    bankCode?: string;
    cardType?: string;
}) {
    try {
        await connectToDatabase();

        const order = await Order.findOne({ orderNumber });
        if (!order) {
            return { success: false, message: "Order not found" };
        }

        // Update order
        order.status = EOrderStatus.PAID;
        order.paymentInfo = {
            ...paymentInfo,
            paymentDate: new Date(),
        };
        await order.save();

        // Grant course access
        const courseIds = order.items.map((item: any) => item.course);
        await User.findByIdAndUpdate(order.user, {
            $addToSet: { purchasedCourses: { $each: courseIds } },
        });

        return {
            success: true,
            message: "Payment processed successfully",
        };
    } catch (error) {
        console.error("[processPaymentSuccess]", error);
        return { success: false, message: "Failed to process payment" };
    }
}

/**
 * Cancel order
 */
export async function cancelOrder(orderNumber: string) {
    try {
        await connectToDatabase();

        const order = await Order.findOneAndUpdate(
            { orderNumber, status: EOrderStatus.PENDING },
            { status: EOrderStatus.CANCELLED },
            { new: true }
        );

        if (!order) {
            return { success: false, message: "Order not found or cannot be cancelled" };
        }

        return {
            success: true,
            message: "Order cancelled successfully",
        };
    } catch (error) {
        console.error("[cancelOrder]", error);
        return { success: false, message: "Failed to cancel order" };
    }
}
