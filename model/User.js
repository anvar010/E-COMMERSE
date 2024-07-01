import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, 
  },
  passwordConfirm: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  street: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  zipCode: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 0 },
    },
  ],
  wishlist: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    },
  ],
  type: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
    default: 'default_profile_image.jpg',
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
},
{
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
