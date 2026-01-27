"use client";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/app/lib/actions/cart.actions";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
    courseId: string;
    courseName: string;
    className?: string;
}

export default function AddToCartButton({
    courseId,
    courseName,
    className = "",
}: AddToCartButtonProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const router = useRouter();

    const handleAddToCart = async () => {
        setIsAdding(true);

        try {
            const result = await addToCart(courseId);

            if (result.success) {
                setIsAdded(true);
                toast.success("Đã thêm vào giỏ hàng!");

                // Reset after 2 seconds
                setTimeout(() => setIsAdded(false), 2000);

                router.refresh();
            } else {
                if (result.message === "Course already in cart") {
                    toast.info("Khóa học đã có trong giỏ hàng");
                } else {
                    toast.error(result.message || "Không thể thêm vào giỏ hàng");
                }
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi");
        } finally {
            setIsAdding(false);
        }
    };

    if (isAdded) {
        return (
            <Button
                disabled
                className={`bg-emerald-600 hover:bg-emerald-700 ${className}`}
            >
                <Check className="w-4 h-4 mr-2" />
                Đã thêm
            </Button>
        );
    }

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 ${className}`}
        >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
        </Button>
    );
}
