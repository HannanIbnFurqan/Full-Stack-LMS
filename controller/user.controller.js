import AppError from "../utils/error.util.js"
import User from '../model/user.Model.js'
import cloudinary from 'cloudinary'
import fs from 'fs'
const cookieOption = {
    maxAge: 7*24*60*60*1000, 
    httpOnly: true,
    secure: true

}
// Register Route
const register = async (req, res, next) => { 
    const { fullname, email, password } = req.body;
    
    console.log(fullname, email, password);

    if (!fullname || !email || !password) {
        return next(new AppError('All fields are required'));
    }

    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
        return next(new AppError('User already exists'));
    }

    // Create new user
    const user = await User.create({
        fullname,
        email,
        password,
        avatar: {
            public_id: " ",
            secure_url: " "
        }
    });

    if (!user) {
        return next(new AppError('User registration failed, please try again'));
    }
    // file upload
    if(req.file){
        console.log('file details = ',JSON.stringify(req.file))
        try {
            const result = await cloudinary.v2.uploader(req.file.path,{
                folder: 'user_avatars',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });
            if(result){
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                //  remove file from server
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (error) {
            return next(
                new AppError(error || 'file not uploaded, please try again',500)
            )
        }
    }

    // Hide password
    user.password = undefined;

    // Generate JWT token
    const token = await user.generateJWTToken();

    // Set token in cookies
    res.cookie('token', token, cookieOption);

    // Success message
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user
    });
};
const login = async (req,res) => {
    const {email, password} = req.body
    if(!email || !password){
        return next(new AppError('All field are require'));
    }
    const user = await User.findOne({email}).select('+password')
    if(!user || !user.comparePassword(password)){
        return next(new AppError('email or password does not match',400));
    }

     const token = user.generateJWTToken()
     res.cookie('token',token,cookieOption)

     res.status(200).json({
        success: true,
        message: 'user loggedin succssfully',
        user
     })
 }
const logout = (req,res) => { 
    res.clearCookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true,
       
    })

    res.status(200).json({
        success: true,
        message: 'user logout successfully'
    })
}

const getUser = async (req,res) => { 
    const userId = req.user.id
    const user = await User.findById(userId)

    res.status(200).json({
        success: true,
        Message: 'user details',
        user
    })
}

export {register,login,logout,getUser}