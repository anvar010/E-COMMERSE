import Product from "../model/Product.js";

const createProduct = async (req, res) => {
    try {
        console.log(req.body);
        const { name, price, description, category, location, stock, productImage } = req.body;

        // Check if productImage is provided
        if (!productImage) {
            return res.status(400).json({
                error: "Product image is required",
                success: false
            });
        }

        const newProduct = new Product({
            name,
            price,
            description,
            category,
            location,
            stock,
            productImage
        });

        const saveProduct = await newProduct.save(); // Await the save operation
        res.status(200).json({
            message: "Product successfully added",
            success: true,
            data: {
                product: saveProduct
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
};

const getAllProduct = async (req,res) =>{
    try {
        const {category} = req.query;
        if(category === "all"){
            const productItems = await Product.find()
       
            res.status(200).json({
                message:"product successfully added",
                success:true,
                data:{
                    product:productItems
                }
            })
        }else{
            const productItems = await Product.find({category:category})
       
            res.status(200).json({
                message:"food successfully added",
                success:true,
                data:{
                    product:productItems
                }
            })
        }
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}
const getNewProducts = async (req,res) =>{
    try {
        const productItems = await Product.find().sort({createdAt:-1}).limit(12)
     
           
       
            res.status(200).json({
                message:"12 register product showing",
                success:true,
                data:{
                    product:productItems
                }
            })
       
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}
const getProductsFromDistinctCategory = async (req,res) =>{
    try {
        const distinctCategory = await Product.distinct("category");
        const distinctproduct = await Promise.all(
            distinctCategory.slice(0,4).map(async (category) =>{
                const product = await Product.findOne({category});
                return product;
            })
        )
     
           
       
            res.status(200).json({
                message:"4 different category product",
                success:true,
                data:{
                    product:distinctproduct
                }
            })
       
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}

const getTopRating = async (req,res) =>{
    try {
        const topRatedProducts = await Product.find().sort({"reviews.rating": -1}).limit(4)
       
     
           
       
            res.status(200).json({
                message:"4 different category product",
                success:true,
                data:{
                    product:topRatedProducts
                }
            })
       
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}
const getProductById = async (req,res) =>{
    try {
        const {id} = req.params;
       const productItems = await Product.findById(id)
       
            res.status(200).json({
                message:"Product details",
                success:true,
                data:{
                    product:productItems
                }
            })
        }
      
        
     catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Internal server error",
            success:false
        })
    }
}



export default { createProduct,
     getAllProduct,getProductById ,
     getNewProducts,
     getProductsFromDistinctCategory,
     getTopRating };