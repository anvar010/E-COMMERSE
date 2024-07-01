import mongoose from 'mongoose';



const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    productImages: [
        { type: String, required: true }
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number },
        comment: { type: String }
    }],
    disabled: { 
        type: Boolean, default: false 
    } 
}, {
    timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
