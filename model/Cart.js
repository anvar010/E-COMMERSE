import mongoose from 'mongoose';

// Define the Cart Item Schema
const CartItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 0
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

export default mongoose.model.CartItems || mongoose.model('CartItem', CartItemSchema);
