"use server";

import Cart, { ICartItem } from "@/database/cart.model";
import Course from "@/database/course.model";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { auth } from "@clerk/nextjs/server";

/**
 * Get user's cart
 */
export async function getCart() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        await connectToDatabase();

        // Get MongoDB user
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        let cart = await Cart.findOne({ user: user._id }).populate("items.course").lean();

        if (!cart) {
            cart = await Cart.create({ user: user._id, items: [] });
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(cart)),
        };
    } catch (error) {
        console.error("[getCart]", error);
        return { success: false, message: "Failed to get cart" };
    }
}

/**
 * Add course to cart
 */
export async function addToCart(courseId: string) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        await connectToDatabase();

        // Get MongoDB user
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Get course details
        const course = await Course.findById(courseId).lean();
        if (!course) {
            return { success: false, message: "Course not found" };
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            cart = await Cart.create({ user: user._id, items: [] });
        }

        // Check if course already in cart
        const existingItem = cart.items.find(
            (item: any) => item.course.toString() === courseId
        );

        if (existingItem) {
            return { success: false, message: "Course already in cart" };
        }

        // Add to cart
        cart.items.push({
            course: courseId as any,
            price: course.price,
            salePrice: course.sale_price,
            addedAt: new Date(),
        });

        await cart.save();

        return {
            success: true,
            message: "Added to cart successfully",
            data: JSON.parse(JSON.stringify(cart)),
        };
    } catch (error) {
        console.error("[addToCart]", error);
        return { success: false, message: "Failed to add to cart" };
    }
}

/**
 * Remove course from cart
 */
export async function removeFromCart(courseId: string) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        await connectToDatabase();

        // Get MongoDB user
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        const cart = await Cart.findOne({ user: user._id });
        if (!cart) {
            return { success: false, message: "Cart not found" };
        }

        cart.items = cart.items.filter(
            (item: any) => item.course.toString() !== courseId
        );

        await cart.save();

        return {
            success: true,
            message: "Removed from cart",
            data: JSON.parse(JSON.stringify(cart)),
        };
    } catch (error) {
        console.error("[removeFromCart]", error);
        return { success: false, message: "Failed to remove from cart" };
    }
}

/**
 * Clear cart
 */
export async function clearCart() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, message: "Unauthorized" };
        }

        await connectToDatabase();

        // Get MongoDB user
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        await Cart.findOneAndUpdate(
            { user: user._id },
            { $set: { items: [] } },
            { new: true }
        );

        return { success: true, message: "Cart cleared" };
    } catch (error) {
        console.error("[clearCart]", error);
        return { success: false, message: "Failed to clear cart" };
    }
}

/**
 * Get cart total
 */
export async function getCartTotal() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return { success: false, total: 0 };
        }

        await connectToDatabase();

        // Get MongoDB user
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return { success: false, total: 0, count: 0 };
        }

        const cart = await Cart.findOne({ user: user._id }).lean();
        if (!cart || cart.items.length === 0) {
            return { success: true, total: 0, count: 0 };
        }

        const total = cart.items.reduce((sum: number, item: ICartItem) => {
            const price = item.salePrice || item.price;
            return sum + price;
        }, 0);

        return {
            success: true,
            total,
            count: cart.items.length,
        };
    } catch (error) {
        console.error("[getCartTotal]", error);
        return { success: false, total: 0, count: 0 };
    }
}
