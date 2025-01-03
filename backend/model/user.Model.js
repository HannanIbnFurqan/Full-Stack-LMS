import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { subscribe } from 'diagnostics_channel';
const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please enter the name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter the email'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter the password'],
        trim: true,
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            default: '' // Set default empty string for consistency
        },
        secure_url: {
            type: String,
            default: '' // Set default empty string for consistency
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription:{
        id: String,
        status: String
    }
}, { timestamps: true }); // Corrected timestamps option


userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
})


userSchema.methods = {
    generateJWTToken: async function() {
        return jwt.sign(
            { id: this._id, email: this.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_Expiry }
        );
    },
    comparePassword: async function(plainText) {
        return await bcrypt.compare(plainText, this.password);
    },
    generatePasswordResetToken: async function(){
        const resetToken = crypto.randomBytes(20).toString('hex');
        this.forgotPasswordToken = crypto.createHash('sha256')
        .update(resetToken).digest('hex');
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
        return resetToken
    }
};

const User = new mongoose.model('User', userSchema)

export default User