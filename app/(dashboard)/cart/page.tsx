import { getCart } from "@/app/lib/actions/cart.actions";
import { redirect } from "next/navigation";
import CartPageClient from "@/components/cart/CartPageClient";

export default async function CartPage() {
    const result = await getCart();

    if (!result.success || !result.data) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
                <p className="text-muted-foreground">Giỏ hàng trống</p>
            </div>
        );
    }

    return <CartPageClient cart={result.data} />;
}
