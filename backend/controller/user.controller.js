import AppError from "../utils/error.util.js"
import User from '../model/user.Model.js'
import cloudinary from 'cloudinary'
import crypto from 'crypto'
import fs from 'fs'
import sendEmail from "../utils/sendEmail.js"
// import sendEmail from "../utils/sendEmail.js"
const cookieOption = {
    maxAge: 7*24*60*60*1000, 
    httpOnly: true,
    secure: true

}

// Register Route
const register = async (req, res, next) => { 
    const { fullname, email, password} = req.body;
    
    console.log(fullname, email, password);

    if (!fullname || !email || !password) {
        return next(new AppError('All fields are required'));
    }

    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
        return next(new AppError('User already exists'));
    }
     // Set default avatar values
     const defaultAvatar = {
        public_id: '',
        secure_url: ''
    };
    // Create new user
    const user = await User.create({
        fullname,
        email,
        password,
        avatar: defaultAvatar
    });

    if (!user) {
        return next(new AppError('User registration failed, please try again'));
    }
      // File upload to Cloudinary
      console.log('req.file.path = ', req.file)

      if (req.file) {
        console.log('file details = ', JSON.stringify(req.file));
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'uploads',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });
            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                  // Remove file from server
                  fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            return next(new AppError(error.message || 'File not uploaded, please try again', 500));
        }
    }

    user.save()
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

const forgotPassword = async (req,res,next)=>{
    const {email} = req.body;
    if(!email){
        return next(new AppError('email is required',400));
    }

    const user = await User.findOne({email})

    if(!user){
        return next(new AppError('email not register',400));
    }

    const resetToken = await user.generatePasswordResetToken();
    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('resetPasswordURL = ',resetPasswordURL)
    const subject = 'Reset password';
    const message = `you can reset your password by clicking ${resetPasswordURL}`
    try {
        await sendEmail(email, subject, message)
        res.status(200).json({
            success: true,
            message: `Reset password token has sent to ${email} successfully`
        })
    } catch (error) {
        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;
        await user.save()
        return next(new AppError(error.message,400));
    }

}
const resetPassword = async (req,res,next)=>{
    const {resetToken} = req.params;
    const {password} = req.body;
    const forgotPasswordToken = crypto.createHash('sha256')
                                      .update(resetToken)
                                      .digest('hex')

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    });

    if(!user){
        return next(
            new AppError('Token is invalid or expired, please try again')
        )
    }

    user.password = password;
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    user.save()

    res.status(200).json({
        success: true,
        message: 'password changed successfully'
    })
}

const changePassword = async(req,res)=>{
    const {oldPassword, newPassword} = req.body;
    const {id} = req.user;

    if(!oldPassword || !newPassword){
        return next(new AppError('All field are mandatory', 400));
    }

    const user = await User.findById(id).select('password');

    if(!user){
        return next(new AppError('User does not exist',400))
    }

    const isPasswordValid = await user.comparePassword(oldPassword);

    if(!isPasswordValid){
        return next(new AppError('Invalid old password',400))
    }

    user.password = newPassword
    await user.save()

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: 'password change successfully'
    })
}


const updateUser = async (req,res)=>{
    const {fullname} = req.body;
    const {id} = req.user.id;

    const user = await User.findById(id);

    if(!user){
        return next(new AppError('User does not exist', 400));
    }

    if(req.fullname){
        user.fullname = fullname;
    }

    if(req.file){
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'uploads',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });
            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                  // Remove file from server
                  fs.rm(`uploads/${req.file.filename}`);
            }
        } catch (error) {
            return next(new AppError(error.message || 'File not uploaded, please try again', 500));
        }

        await user.save()

        res.status(200).json({
            success: true,
            message: 'User details updated successfully'
        })
    }
}
export {register,login,logout,getUser, forgotPassword, resetPassword, changePassword, updateUser}