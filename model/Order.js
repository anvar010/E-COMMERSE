import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {
            food:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true,
            },
            qty:{
                type:Number,
                required:true,
                min:1
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true,
    },
    payment:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:["Pending","Delivered"],
        default:"Pending",
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
  
},{
    timestamps:true
    })



export default mongoose.model.Orders || mongoose.model("Order", OrderSchema);