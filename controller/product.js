import Product from "../model/Product.js";
import jwt from 'jsonwebtoken';

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
  
      const saveProduct = await newProduct.save(); 
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
        const productCount = await Product.countDocuments(); // Get the total count of products

        res.status(200).json({
            message: "All products successfully fetched",
            success: true,
            data: {
                product: productItems,
                totalProducts: productCount // Include total product count in the response
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

const getProductsBySeller = async (req, res) => {
    try {
        const { id } = req.params; // Assuming 'id' corresponds to 'userId' in your case
        const productItems = await Product.find({ userId: id });

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
};

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

export const addProductReview = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({
                error: "Authorization header is missing",
                success: false
            });
        }

        const token = authorizationHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.id;

        const { id } = req.params; // Product ID
        const { rating, comment } = req.body;
        const userId = req.userId;

        console.log("userId:", userId);

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                error: "Product not found",
                success: false
            });
        }

        const newReview = {
            user: userId,
            rating,
            comment
        };

        // Add the new review to the product's reviews array
        product.reviews.push(newReview);

        // Calculate the new average rating
        const totalReviews = product.reviews.length;
        let sumRatings = 0;
        for (const review of product.reviews) {
            sumRatings += review.rating;
        }
        const averageRating = sumRatings / totalReviews;

        product.rating = averageRating;

        await product.save();

        res.status(201).json({
            message: "Review added successfully",
            success: true,
            data: {
                review: newReview
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


const getProductReviews = async (req, res) => {
    try {
        const { id } = req.params; // Product ID

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                error: "Product not found",
                success: false
            });
        }

        // Return reviews for the product
        res.status(200).json({
            message: "Product reviews fetched successfully",
            success: true,
            data: {
                reviews: product.reviews
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

const getProductByName = async (req, res) => {
    try {
      const { productName } = req.params;
  
      if (!productName) {
        return res.status(400).json({
          error: "Product name parameter is required",
          success: false
        });
      }
  
      // Perform case-insensitive search for products matching the productName in name or category
      const productItems = await Product.find({
        $or: [
          { name: { $regex: new RegExp(productName, 'i') } },
          { category: { $regex: new RegExp(productName, 'i') } }
        ]
      });
  
      if (productItems.length === 0) {
        return res.status(404).json({
          message: `No products found with name or category matching '${productName}'`,
          success: true,
          data: {
            products: []
          }
        });
      }
  
      res.status(200).json({
        message: `Products with name or category matching '${productName}' successfully fetched`,
        success: true,
        data: {
          products: productItems
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Internal server error",
        success: false
      });
    }
  };
  
  










  








export default { createProduct,
     getAllProduct,getProductById ,
     getNewProducts,
     SpecialProducts,
     getTopRating,
     editProduct,
     getProductsByUserId,
     getProductsBySeller,
     getProductsByCategory,
     addProductReview,
     getProductReviews,
     getProductByName,

      };