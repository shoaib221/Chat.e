import express from "express"
import { User } from "../auth/model.js"
import { Student } from "../pagination/model.js";

export const miscelRouter = express.Router();



const SearchUsers = async (req, res, next) => {
    try {
        const { user_name } = req.query
        let users = await User.find({
            name: { $regex: user_name, $options: "i" }
        });

        users = await User.find({
            $or: [
                { name: { $regex: user_name, $options: "i" } },
                { email: { $regex: user_name, $options: "i" } },
                { username: { $regex: user_name, $options: "i" } },
            ]
        });

        res.status(200).json({ users })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}


const SearchStudents = async (req, res, next) => {

    try {

        const { country } = req.query

        let pipeline = []

        if (country) pipeline.push({
            $match: {
                country: country
            }
        })

        pipeline.push(

            {
                $group: {
                    _id: '$country',
                    students: { $sum: 1 }
                }
            }

        )


        let students = await Student.aggregate(pipeline).sort({ students: -1 }).limit(5)

        res.status(200).json({ students })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}


const SearchJobs = async (req, res, next) => {

    try {
        let pipeline = [];

        pipeline.push({
            $lookup: {
                from : 'jobs',
                localField: 'username',
                foreignField: 'ownerEmail',
                as: 'Jobs'
            }
        })

        let data = await User.aggregate(pipeline)

        res.status(200).json({data})


    } catch(err) {
        res.status(400).json({ error: err.message });
    }
}



miscelRouter.get("/users", SearchUsers);
miscelRouter.get("/students-by-country", SearchStudents);
miscelRouter.get("/search-jobs", SearchJobs);

