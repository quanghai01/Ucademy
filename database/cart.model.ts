import { Document, model, models, Schema } from "mongoose";

export interface ICartItem {
    course: Schema.Types.ObjectId;
    price: number;
    salePrice?: number;
    addedAt: Date;
}

export interface ICart extends Document {
    user: Schema.Types.ObjectId;
    items: ICartItem[];
    updatedAt: Date;
    createdAt: Date;
}

const cartSchema = new Schema<ICart>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        items: [
            {
                course: {
                    type: Schema.Types.ObjectId,
                    ref: "Course",
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                salePrice: {
                    type: Number,
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Cart = models.Cart || model<ICart>("Cart", cartSchema);
export default Cart;
