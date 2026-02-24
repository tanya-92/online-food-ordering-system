import mongoose from 'mongoose';

const canteenSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    place: {
        type: String,
        required: true,
    },
    openingTime: {
        type: String,
        required: true,
    },
    closingTime: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop',
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    }
}, {
    timestamps: true,
});

const Canteen = mongoose.model('Canteen', canteenSchema);

export default Canteen;
