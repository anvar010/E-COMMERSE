import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type:String,
        default:'admin'
    }
}, {
    collection: 'admin' 
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
