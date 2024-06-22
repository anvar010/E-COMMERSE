import mongoose from "mongoose";
import bcrypt from "bcrypt"
import validator from "validator";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail, "Please provide email"]
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        select:false,
     },
     passwordConfirm:{
        type:String,
        required:true,
        minlength:8,
        select:false,
        validate:{
            validator:function(el){
                return el === this.password
            },
            message:"Password are not match"
        },
     },
     street:{
        type:String,
        required:false
     },
     city:{
        type:String,
        required:false
     },
     state:{
        type:String,
        required:false
     },
     zipCode:{
        type:String,
        required:false
     },
     country:{
        type:String,
        required:false
     },
    //  isVerified:{
    //     type:Boolean,
    //     default:false,
    //     select:false
    //  },
    //  otp:{
    //     type:Number,
    //  },
    //  role:{
    //     type:String,
    //     enum:["user","admin"],
    //     default:"user"
    //  },
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 0 },
      },
    ],
    wishlist: [
      {
          product: {  type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
      }
  ],
    type: {
        type: String,
        required: true,
        unique: false
    },
     profileImage:{
        type:String,
        required:true,
       default: 'default_profile_image.jpg'
     },

},
{
   timestamps:true,
}
)
export default mongoose.model.Users || mongoose.model("User", UserSchema);