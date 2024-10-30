import Course from "../model/course.Model.js"
import AppError from "../utils/error.util.js";

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

export {getAllCourses, getLecturesByCoureId}