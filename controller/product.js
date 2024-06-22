import Product from "../model/Product.js";

const createProduct = async (req, res) => {
    try {
      const { name, price, description, category, location, stock, productImages } = req.body;
      const userId = req.userId;
  
      if (!productImages || !productImages.length) {
        return res.status(400).json({
          error: "Product images are required",
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
        productImages,
        userId
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
  
  

  const getAllProduct = async (req, res) => {
    try {
        const productItems = await Product.find();
       
        res.status(200).json({
            message: "All products successfully fetched",
            success: true,
            data: {
                product: productItems
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
const SpecialProducts = async (req,res) =>{
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

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category, location, stock, productImages } = req.body;

        if (!productImages || !productImages.length) {
            return res.status(400).json({
                error: "Product images are required",
                success: false
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                price,
                description,
                category,
                location,
                stock,
                productImages
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                error: "Product not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Product successfully updated",
            success: true,
            data: {
                product: updatedProduct
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



const getProductsByUserId = async (req, res) => {
    try {
        const userId = req.userId;
        const productItems = await Product.find({ userId });

        res.status(200).json({
            message: "Products added by the user",
            success: true,
            data: {
                products: productItems
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}

const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params; // Assuming category is passed as a parameter in the URL
        const productItems = await Product.find({ category });

        res.status(200).json({
            message: `Products in category ${category} successfully fetched`,
            success: true,
            data: {
                products: productItems
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
}
//Not show the Outof Stock product
// const getProductsByCategory = async (req, res) => {
//     try {
//         const { category } = req.params; // Assuming category is passed as a parameter in the URL
//         const productItems = await Product.find({ category });

//         // Filter out products that have stock less than or equal to 0
//         const availableProducts = productItems.filter(product => product.stock > 0);

//         res.status(200).json({
//             message: `Products in category ${category} successfully fetched`,
//             success: true,
//             data: {
//                 products: availableProducts
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             error: "Internal server error",
//             success: false
//         });
//     }
// }




  








export default { createProduct,
     getAllProduct,getProductById ,
     getNewProducts,
     SpecialProducts,
     getTopRating,
     editProduct,
     getProductsByUserId,
     getProductsByCategory,
      };