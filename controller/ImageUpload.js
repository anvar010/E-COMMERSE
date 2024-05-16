import cloudinary from "cloudinary"
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const imageUploadController = async (req,res) =>{
    try{
        const result = await cloudinary.uploader.upload(req.files.image.path)
        res.json({
            url:result.secure_url,
            public_id:result.public_id,
        })
    }catch(error){
        console.log(error);
    }
}
export default imageUploadController