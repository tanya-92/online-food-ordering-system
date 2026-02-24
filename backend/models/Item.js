import mongoose from 'mongoose';

const itemSchema = mongoose.Schema({
    canteen: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Canteen',
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

export default Item;
