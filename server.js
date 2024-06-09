import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import imageRoute from "./routes/image.js";
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js"
import cartRoute from "./routes/cart.js"
import orderRoute from "./routes/order.js";

const app = express();

dotenv.config();
import cors from "cors";
const port = process.env.PORT || 8000

app.use(cors());
app.get("/",(req,res)=>{
    res.send("hello")
})


//connect db

const connect = async () =>{
    try{
        await mongoose.connect(process.env.DB_URI);
        console.log("connected successfully");
    }catch(error){
        throw error;
    }
}
app.use(express.json({limit : "3mb"}))
app.use("/api/v1/all",imageRoute)
app.use("/api/v1/user",userRoute)
app.use("/api/v1/product",productRoute)
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);


app.listen(port,()=>{
    connect();
    console.log(`listening from ${port}`);
})