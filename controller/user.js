import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import Product from "../model/Product.js";
import mongoose from 'mongoose';

const registerController = async (req,res) =>{
    try {
        const existingUser = await User.findOne({email:req.body.email});
        if(existingUser){
            return res.status(200).send({
                message:"User already exist",
                success:false,
            });
        }
        // const addToCart = async (req, res) => {
        //     try {
        //       const userId = req.user.id;
        //       const productId = req.body.productId;
        //       const quantity = req.body.quantity || 1;
          
        //       const user = await User.findById(userId);
          
        //       // Check if the product is already in the user's cart
        //       const existingCartItem = user.cart.find((item) => item.product.toString() === productId);
          
        //       if (existingCartItem) {
        //         existingCartItem.quantity += quantity;
        //       } else {
        //         user.cart.push({ product: productId, quantity });
        //       }
          
        //       await user.save();
          
        //       res.status(200).json({
        //         message: 'Product added to cart successfully',
        //         success: true,
        //         data: {
        //           user,
        //         },
        //       });
        //     } catch (error) {
        //       console.error(error);
        //       res.status(500).json({
        //         error: 'Internal server error',
        //         success: false,
        //       });
        //     }
        //   };
          
        //   const getCart = async (req, res) => {
        //     try {
        //       const userId = req.user.id;
        //       const user = await User.findById(userId).populate('cart.product');
          
        //       res.status(200).json({
        //         message: 'User cart retrieved successfully',
        //         success: true,
        //         data: {
        //           cart: user.cart,
        //         },
        //       });
        //     } catch (error) {
        //       console.error(error);
        //       res.status(500).json({
        //         error: 'Internal server error',
        //         success: false,
        //       });
        //     }
        //   };
          
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);
        req.body.password = hashPassword;

        const confirmPassword = await bcrypt.hash(req.body.passwordConfirm,salt)

        req.body.passwordConfirm = confirmPassword;
        if(req.body.password === req.body.passwordConfirm){
            const newUser = new User({
                name:req.body.name,
                email:req.body.email,
                type:req.body.type,
                profileImage:req.body.profileImage,
                password:req.body.password,
                passwordConfirm:req.body.passwordConfirm,
            });
            await newUser.save();

            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
                expiresIn:"1d",
            })
            return res.status(201).send({
                message:"Register successfully",
                data:{
                    user:newUser,
                    token,
                },
                success:true
            })
        }else{
            return res.status(201).send({
                message:"password not match",
                success:false
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message:"register error",
            success:false
        })
        
    }
}

const authController = async (req,res) =>{
    try {
        const user = await User.findOne({_id:req.body.userId});
        if(!user){
            return res.status(200).send({
                message:"User not found",
                success:false,
            })
        }
        else{
            console.log(user);
            return res.status(200).send({
                message:"Register successfully",
                data:{
                    user,
                },
                success:true
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:`Auth error`
        });
        
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).send({
                message: "Email is required",
                success: false
            });
        }

        if (!password) {
            return res.status(400).send({
                message: "Password is required",
                success: false
            });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).send({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        user.password = undefined;

        return res.status(201).send({
            message: "Login successfully",
            data: {
                user,
                token
            },
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Auth error"
        });
    }
};

const updateUserProfile = async (req,res) =>{
    try {
        const { name, 
            profileImage,
            userId,
        street,
    city,
state,
zipCode,
country,}= req.body;
const user = await User.findById(userId)
if(!user){
    return res.status(200).send({
        message:"User not found",
        success:false
    })
}
user.name = name || user.name
user.profileImage =profileImage || user.profileImage
user.street = street || user.street
user.city = city || user.city
user.state = state || user.state
user.zipCode = zipCode || user.zipCode
user.country = country || user.country
await user.save()
return res.status(200).send({
    message:"Profile update successfully",
    success:true,
})

        
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            message:"user error",
            success:false
        })
    }
}

const getDropdownOptions = async (req, res) => {
    try {
        const options = ["buyer", "seller"];

        // console.log("Dropdown Options:", options);

        return res.status(200).json({
            options: options,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching dropdown options:", error);
        return res.status(500).json({
            error: 'Internal server error',
            success: false,
        });
    }
};

export const addToWishlist = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        console.log('Token:', token);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Unauthorized - Token invalid' });
        }

        const userId = decoded.id;
        const productId = req.body.productId;

        if (!productId) {
            return res.status(400).json({ error: 'Invalid productId' });
        }

        const user = await User.findById(userId);
        console.log('User:', user);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if the product is already in the wishlist
        const existingWishlistItem = user.wishlist.find(item => item.product.toString() === productId);

        if (existingWishlistItem) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        // Add the new item to the wishlist
        user.wishlist.push({ product: productId });

        await user.save();

        res.status(200).json({
            message: 'Product added to wishlist successfully',
            success: true,
            data: {
                user,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal server error',
            success: false,
        });
    }
};


const moveToCart = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        console.log('Token:', token);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Unauthorized - Token invalid' });
        }

        const userId = decoded.id;
        const productId = req.body.productId;

        if (!productId) {
            return res.status(400).json({ error: 'Invalid productId' });
        }

        const user = await User.findById(userId);
        console.log('User:', user);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the wishlisted item
        const wishlistedItem = user.wishlist.find(item => item.product.toString() === productId);

        if (!wishlistedItem) {
            return res.status(404).json({ error: 'Product not found in wishlist' });
        }

        // Add the product to the cart
        const existingCartItem = user.cart.find(item => item.product.toString() === productId);

        if (existingCartItem) {
            existingCartItem.quantity += 1; // Increment quantity if already in cart
        } else {
            user.cart.push({ product: productId, quantity: 1 }); // Add to cart if not already there
        }

        // Remove the product from the wishlist
        user.wishlist = user.wishlist.filter(item => item.product.toString() !== productId);

        await user.save();

        res.status(200).json({
            message: 'Product moved to cart successfully',
            success: true,
            data: {
                user,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal server error',
            success: false,
        });
    }
};






export const removeFromWishlist = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        console.log('Token:', token);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Unauthorized - Token invalid' });
        }

        const userId = decoded.id;
        const productId = req.body.productId;

        if (!productId) {
            return res.status(400).json({ error: 'Invalid productId' });
        }

        const user = await User.findById(userId);
        console.log('User:', user);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Filter out the product from the wishlist
        user.wishlist = user.wishlist.filter(
            (item) => item.product.toString() !== productId
        );

        await user.save();

        res.status(200).json({
            message: "Product removed from wishlist successfully",
            success: true,
            wishlist: user.wishlist,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal server error',
            success: false,
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        console.log('Token:', token);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Unauthorized - Token invalid' });
        }

        const userId = decoded.id;

        const user = await User.findById(userId).populate('wishlist.product');
        console.log('User:', user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'Wishlist retrieved successfully',
            success: true,
            data: {
                wishlist: user.wishlist,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal server error',
            success: false,
        });
    }
};

const removeSingleWishlistItem = async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        console.log('Token:', token);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ error: 'Unauthorized - Token invalid' });
        }

        const userId = req.params.userId;
        const productId = req.params.productId;

        if (!userId || !productId) {
            return res.status(400).json({ error: 'Invalid userId or productId' });
        }

        const user = await User.findById(userId);
        console.log('User:', user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.wishlist = user.wishlist.filter(
            (item) => item.product.toString() !== productId
        );

        await user.save();

        res.status(200).json({
            message: "Product removed from wishlist successfully",
            success: true,
            wishlist: user.wishlist,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal server error',
            success: false,
        });
    }
};

const switchUserType = async (req, res) => {
    try {
        const userId = req.params.userId; // Assuming userId is passed in the URL parameters

        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.type = user.type === 'buyer' ? 'seller' : 'buyer';

        await user.save();

        res.status(200).json({
            message: 'User type updated successfully',
            success: true,
            data: {
                user,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal server error',
            success: false,
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      const totalUsers = users.length; 
  
      return res.status(200).json({
        message: "All users retrieved successfully",
        success: true,
        data: {
          totalUsers: totalUsers,
          users: users,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Internal server error",
        success: false,
      });
    }
  };
  

  const getUserById = async (req, res) => {
    try {
      const userId = req.params.id; 
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }
  
      return res.status(200).json({
        message: "User retrieved successfully",
        success: true,
        data: {
          user: user,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Internal server error",
        success: false,
      });
    }
  };



  

export default { registerController,
     authController ,
      loginController,
    updateUserProfile,
    getDropdownOptions,
    addToWishlist,
    moveToCart,
    removeFromWishlist,
    getWishlist,
    removeSingleWishlistItem,
    switchUserType,
    getAllUsers,
    getUserById
     };