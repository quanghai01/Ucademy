import { Document, model, models, Schema } from "mongoose";
import { EOrderStatus, EPaymentMethod } from "@/app/types/enums";

export interface IOrderItem {
    course: Schema.Types.ObjectId;
    title: string;
    price: number;
    salePrice?: number;
}

export interface IPaymentInfo {
    transactionId?: string;
    bankCode?: string;
    paymentDate?: Date;
    cardType?: string;
}

export interface IOrder extends Document {
    orderNumber: string;
    user: Schema.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    status: EOrderStatus;
    paymentMethod: EPaymentMethod;
    paymentInfo?: IPaymentInfo;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        items: [
            {
                course: {
                    type: Schema.Types.ObjectId,
                    ref: "Course",
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                salePrice: {
                    type: Number,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: Object.values(EOrderStatus),
            default: EOrderStatus.PENDING,
            index: true,
        },
        paymentMethod: {
            type: String,
            enum: Object.values(EPaymentMethod),
            required: true,
        },
        paymentInfo: {
            transactionId: String,
            bankCode: String,
            paymentDate: Date,
            cardType: String,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = models.Order || model<IOrder>("Order", orderSchema);
export default Order;
