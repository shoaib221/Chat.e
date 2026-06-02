import express from "express";
export const productRouter = express.Router();
import { Category, Job } from "./model.js";
import { requireAuth } from "../auth/middlewire.js";
import { FetchJobs } from "./method.js";


const FetchCategory = async ( req, res, next ) => {
    console.log(req.body);
    try {
        const result = await Category.find({});
        res.status(200).json( {result} );
    } catch(err) {
        res.status(400).json( { error: err.message } );
    }
}


const AddJob = async (req, res, next) => {

    const { title, photo, summary, category } = req.body;
    let new_job =  {
        title, coverImage: photo, summary, category, postedBy: req.name, ownerEmail: req.user_email,
        acceptedBy: "none"
    }

    console.log(new_job);
    try {
        new_job = await Job.create(new_job )
        res.status(200).json({ job: new_job})
        
    } catch(err) {
        console.log( err.message )
        res.status(400).json( { error: err.message } )
    }
}



const AllJobs = async (req, res, next) => {
    console.log("all jobs")
    try {
        const params = req.query;

        let result = await FetchJobs( params, [] )
        res.status(200).json(result)
    } catch(err) {
        res.status(400).json( { error: err.message } )
    } 
}


const JobDetail = async ( req, res, next ) => {
    const job_id = req.params.id
    try {
        const job  = await Job.findOne( { _id: job_id } )
        res.status(200).json( job )
    } catch(err) {
        res.status(400).json({ error: err.message })
    }
}


const AcceptJob = async ( req, res, next ) => {
    //console.log( req.body )
    let { job_id, ownerEmail } = req.body;

    try {
        if( ownerEmail === req.user_email ) throw Error("Not Allowed")
        let job = await Job.findOne( { _id: job_id } )
        if( job.acceptedBy !== 'none' ) throw Error("Already Alloted")
        //console.dir(job)
        job.acceptedBy = req.user_email;
        job.status = 'pending';
        await job.save();
        res.status(200).json( { job } )
    } catch(err) {
        console.dir(err)
        res.status(400).json( { error: err.message } )
    }
}

// req.user_email = userInfo.email;
// req.name = userInfo.name;

const MyJobs = async ( req, res, next ) => {
    console.log("my jobs");

    try {
        const params = req.query;
        let pipeline = []

        pipeline.push( { $match: { ownerEmail: req.user_email } } )

        let result = await FetchJobs( params, pipeline )
        res.status(200).json(result)
    } catch(err) {
        res.status(400).json( { error: err.message } )
    }
}


const MyTask = async (req, res, next) => {
    console.log("my task")

    try {
        const params = req.query;
        let pipeline = []

        pipeline.push( { $match: { acceptedBy: req.user_email } } )

        let result = await FetchJobs( params, pipeline )
        res.status(200).json(result)
    } catch(err) {
        res.status(400).json( { error: err.message } )
    }
}


const DeleteJob = async (req, res, next) => {
    try {
        const job_id = req.params.id;
        let job = await Job.findOne({ _id : job_id });
        if( job.ownerEmail !== req.user_email && job.acceptedBy !== req.user_email ) throw Error("Unauthorized request");
        await Job.findByIdAndDelete(job_id);
        res.status(200).json({ msg: "success" });
    } catch(err) {
        res.status(400).json( { error: err.message } )
    }
}


const UpdateJob = async ( req, res, next ) => {
    console.log( "update job" )

    try {
        const { _id: job_id} = req.body;
        let job =  await Job.findById( job_id )
        if( job.ownerEmail !== req.user_email ) throw Error("Unauthorized");

        // console.log(job);
        const updation = { ...req.body }
        // console.log(updation)
        job = await Job.findByIdAndUpdate( job_id, updation, { new: true } )
        // console.log(job)
        res.status(200).json( { job } )
    } catch (err) {
        console.log( err.message )
        res.status(400).json( { error: err.message } )
    }
}


const CancelTask  = async  (req, res, next) => {
    console.log( "cancel task" );
    try {
        let { job } = req.body;
        job = await Job.findById( job._id );
        if( job.acceptedBy !== req.user_email ) throw Error("Not Allowed");
        job.acceptedBy = 'vacant';
        job = await job.save();
        res.status(200).json( { job } );
    } catch (err) {
        res.status(400).json( { error : err.message } );
    }
}

const CompleteTask = async ( req, res, next ) => {
    console.log( "cancel task" );
    try {
        let { job } = req.body;
        job = await Job.findById( job._id );
        if( job.acceptedBy !== req.user_email ) throw Error("Not Allowed");
        job.status = 'completed';
        await job.save();
        res.status(200).json( { job } );
    } catch (err) {
        res.status(400).json( { error : err.message } );
    }
}


productRouter.get( "/category", FetchCategory );
productRouter.post( "/add-job", requireAuth, AddJob );
productRouter.get( "/all-jobs", AllJobs );
productRouter.get( "/job/:id", requireAuth, JobDetail );
productRouter.post( "/accept-job", requireAuth, AcceptJob );
productRouter.get( "/my-jobs", requireAuth, MyJobs );
productRouter.get( "/my-task", requireAuth, MyTask );
productRouter.delete( "/job/:id", requireAuth, DeleteJob );
productRouter.post( "/update_job", requireAuth, UpdateJob );
productRouter.post( "/cancel-task", requireAuth, CancelTask );
productRouter.post( "/complete-task", requireAuth, CompleteTask )


