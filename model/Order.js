// import mongoose from 'mongoose';


// const OrderSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User', required: true },
//   productId: {
//     type: mongoose.Schema.Types.ObjectId, 
//     ref : 'Product',
//     required: true
//   },
//   quantity: {
//     type: Number,
//     default: 1
//   },
// });

// // const Order = mongoose.model('Order', OrderSchema);

// export default mongoose.model.Order || mongoose.model("Order", OrderSchema);

import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true },
    quantity: { 
      type: Number, 
      default: 1 }
  }]
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

