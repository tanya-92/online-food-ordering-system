import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    canteen: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Canteen',
    },
    items: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: String },
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
            },
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    token: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Paid', 
        enum: ['Paid', 'Preparing', 'Ready', 'Completed', 'Cancelled']
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
