import Course from "../model/course.Model.js"
import AppError from "../utils/error.util.js";
import fs from 'fs'
import cloudinary from 'cloudinary'
// import path from 'path'
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


const createCourse = async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy) {
        return next(new AppError('All fields are required', 400));
    }

    try {
        // Ensure that Course.create is awaited to get a resolved object
        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: 'Dummy',   // Initial placeholder values
                secure_url: 'Dummy'
            }
        });

        if (!course) {
            return next(new AppError('Course could not be created, please try again', 500));
        }

        // If a file is uploaded, attempt to upload to Cloudinary
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'uploads'
            });

            if (result) {
                // Set Cloudinary response values
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }

            // Delete the file from the local system after upload
            fs.rm(`upload/${req.file.filename}`, { force: true }, (err) => {
                if (err) console.error("File delete error:", err);
            });
        }

        // Save changes to the course document after setting thumbnail
        await course.save();

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Course created successfully'
        });
        
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
};

const updateCourse = async (req,res,next)=>{
   try {
    const {id} = req.params;
    const course = await Course.findByIdAndUpdate(id,{$set:req.body},{runValidators:true});

    if(!course){
        return next(new AppError('Course with given id does not exist',500))
    }

    res.status(200).json({
        success:true,
        message:'course update successfully'
    })
   } catch (error) {
    return next(new AppError(error.message,500))

   }
}
const removeCourse = async (req,res,next)=>{
   try {
    const {id} = req.params;
    const course = await Course.findById(id);
    if(!course){
        return next(new AppError('Course with given id does not exist',500))
    }

    await Course.findByIdAndDelete(id)

    res.status(200).json({
        success: true,
        message: 'successfully remove',
        Course
    })
   } catch (error) {
    return next(new AppError(error.message,500))
   }
}

const addLectureToCourseById = async ()=>{
  try {
    const {title, description} = req.body;
  const {id} = req.params;
  
  const course = await Course.findById(id);

  if (!title || !description) {
    return next(new AppError('All fields are required', 400));
}
  if(!course){
    return next(new AppError('Course with given id does not exist',500))
}

const lectureData = {
    title,
    description,
    lectures:{}
};

if (req.file) {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'uploads'
    });

    if (result) {
        // Set Cloudinary response values
        course.lectures.public_id = result.public_id;
        course.lectures.secure_url = result.secure_url;
    }

    // Delete the file from the local system after upload
    fs.rm(`upload/${req.file.filename}`, { force: true }, (err) => {
        if (err) console.error("File delete error:", err);
    });
}
course.lectures.push(lectureData);

course.numberOfLectures = course.lectures.length;

await course.save()
 res.status(200).json({
    success: true,
    message: 'lecture successfully added to the course',
    course
 })

    
  } catch (error) {
    return next(new AppError(error.message,404))
    
  }
}

export {getAllCourses, getLecturesByCoureId, createCourse, updateCourse, removeCourse, addLectureToCourseById}