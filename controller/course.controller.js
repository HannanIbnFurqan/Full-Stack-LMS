import Course from "../model/course.Model.js"
import AppError from "../utils/error.util.js";
import fs from 'fs'
import cloudinary from 'cloudinary'
import path from 'path'
const getAllCourses = async (req,res)=>{
   try {
    const Courses = await Course.find({}).select('-lectures');
    res.status(200).json({
        success: true,
        message:'All Course',
        Courses
    })
    
   } catch (error) {
    return next(new AppError(error.message, 500)) 
   }
}

const getLecturesByCoureId = async ()=>{
   try {
    const {id} = req.params;
    const course = await Course.findById(id);
    if(!course){
        return next(new AppError("Course not found", 500))
    }
    res.status(200).json({
        success: true,
        message: 'Course lectures fetched successfully',
        lectures: course.lectures
    })
    
   } catch (error) {
      return next(new AppError(error.message, 500))
   }

}


const createCourse = async (req,res,next)=>{
    const {title, description, category, createdBy} = req.body;
    if(!title || !description || !category || !createdBy){
        return next(new AppError('All fields are required',400));
    }

   try {
    const course = Course.create({
        title,
        description,
        category,
        createdBy
    });

    if(!course){
        return next(new AppError('Course could not creatd, please try again',500));
    }

    if(req.file){
        const result = await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms'
        });
        if(result){
            course.thumbnail.public_id = result.public_id;
            course.thumbnail.secure_url = result.secure_url;
        }
        fs.rm(`upload/${req.file.filename}`);
    }

    await course.save();
    res.status(200).json({
        success:true,
        message:'course created successfully'
    })
    
   } catch (error) {
    return next(new AppError(error.message, 500))
   }

}
const updateCourse = async (req,res,next)=>{}
const removeCourse = async (req,res,next)=>{}

export {getAllCourses, getLecturesByCoureId, createCourse, updateCourse, removeCourse}