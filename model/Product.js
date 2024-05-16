import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }



})

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    reviews:[ReviewSchema],
   productImage: {
    type: String,
    required: true
  },


},{
timestamps:true
}
)
export default mongoose.model.Products || mongoose.model("Product", ProductSchema);