

import mongoose from 'mongoose';


const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    postedBy: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    coverImage : {
        type: String,
        required: true,
        default: "https://assets-news.housing.com/news/wp-content/uploads/2023/03/24161030/Types-of-hammers-Different-types-and-their-applications-f.jpg"
    },
    ownerEmail: {
        type: String
    },
    acceptedBy: {
        type: String,
        required: 'none',
        default: 'none'
    },
    status: {
        type: String,
        required: true,
        default: "vacant"
    }
}, { timestamps: true }  );


JobSchema.index( { title: 1, postedBY: 1 } );
export const Job = mongoose.model("Job", JobSchema);


const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

export const Category = mongoose.model( 'Category', CategorySchema );





