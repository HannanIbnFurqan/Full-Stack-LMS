import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minLength: [8, "Title must be atleast 8 characters"],
        maxLength: [59, "Title should be less than 60 characters"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "description is required"],
        minLength: [8, "description must be atleast 8 characters"],
        maxLength: [200, "description should be less than 200 characters"],
    },
    category: {
        type: String,
        required: [true, "category is required"],
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String,
                    // required: true
                },
                secure_url: {
                    type: String,
                    // required: true
                }
            }
        }
    ],

    numberOfLectures: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type: String,
        required:true
    }

}, { timestamps: true })


const Course = mongoose.model('Course',courseSchema);

export default Course;