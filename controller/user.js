import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const registerController = async (req,res) =>{
    try {
        const existingUser = await User.findOne({email:req.body.email});
        if(existingUser){
            return res.status(200).send({
                message:"User already exist",
                success:false,
            });
        }
        const addToCart = async (req, res) => {
            try {
              const userId = req.user.id;
              const productId = req.body.productId;
              const quantity = req.body.quantity || 1;
          
              const user = await User.findById(userId);
          
              // Check if the product is already in the user's cart
              const existingCartItem = user.cart.find((item) => item.product.toString() === productId);
          
              if (existingCartItem) {
                existingCartItem.quantity += quantity;
              } else {
                user.cart.push({ product: productId, quantity });
              }
          
              await user.save();
          
              res.status(200).json({
                message: 'Product added to cart successfully',
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
          
          const getCart = async (req, res) => {
            try {
              const userId = req.user.id;
              const user = await User.findById(userId).populate('cart.product');
          
              res.status(200).json({
                message: 'User cart retrieved successfully',
                success: true,
                data: {
                  cart: user.cart,
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


export default { registerController,
     authController ,
      loginController,
    updateUserProfile };