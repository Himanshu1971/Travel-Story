import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import config from "./config.json" assert {type:'json'};
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import authenticationToken from "./utilities.js";
import TravelStory from "./models/travelstory.model.js";
import upload from "./multer.js";
import fs from "fs";
import path from "path";
import { error } from "console";
// import { randomBytes } from 'crypto';

// const randomHex = randomBytes(64).toString('hex');
// console.log(randomHex);

dotenv.config();

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({origin:"*"}))
app.use('/uploads', express.static('uploads'));
app.use('/assets', express.static('assets'));

// Create Account
app.post("/create-account",async(req,res)=>{
   const {fullname,email,password} = req.body;

   if(!email || !fullname || !password){
    return res.status(400).json({error:true,message:"All fields are required"});
   }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({error:true,message:"User already exists"});
    }

   const hashedPassword = await bcrypt.hash(password,10);

   const user = new User({
    fullname,
    email,
    password:hashedPassword,
   });

   await user.save();

   const accessToken = jwt.sign(
    {userId:user._id},
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:"72h",
    }
   );

   return res.status(201).json({
    error:false,
    user:{fullname:user.fullname, email:user.email},
    accessToken,
    message:"Registration Successful",
   });
})

// Login
app.post("/login",async (req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"Email and password are required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid Credentials"});
    }

    const accessToken = jwt.sign(
        {userId:user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"72h",
        }
    );

    return res.json({
        error:false,
        message:"Login Successful",
        user:{fullname:user.fullname,email:user.email},
        accessToken,
    });
})


// Get User
app.get("/get-user",authenticationToken,async (req,res)=>{
    const {userId} = req.user;

    const isUser = await User.findOne({_id:userId});
    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user:isUser,
        message:"",
    });
})

// Route to handle Image Upload
app.post("/image-upload",upload.single("image"),async (req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({error:true, message:"No file uploaded"});
        }

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(201).json({imageUrl});
    } catch (error) {
        res.status(500).json({error:true , message:error.message});
    }
})

// delete an image from uploads folder
app.delete("/delete-image", async (req,res)=>{
    const {imageUrl} = req.query;

    if(!imageUrl){
        return res.status(400).json({error:true , message:"imageUrl parameter is required"});
    }

    try {
        // define the filename
        const filename = path.basename(imageUrl);

        const filePath = path.join('uploads',filename)

        // check if file exist 
        if(fs.existsSync(filePath)){
            // delete the file from uploads folder
            fs.unlinkSync(filePath);
            res.status(200).json({message:"Image deleted successfully"});
        }else{
            res.status(200).json({error:true , message:"Image not found"});
        }
    } catch (error) {
        res.status(500).json({error:true , message:error.message})
    }
    
    
})


// Add Travel Story
app.post("/add-travel-story",authenticationToken,async (req,res)=>{
    const {title,story,visitedLocation,imageUrl,visitedDate} = req.body;

    const {userId} = req.user;

    if(!title || !story || !visitedLocation || !imageUrl || !visitedDate){
        return res.status(400).json({error:true,message:"All fields are required"});
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelstory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate:parsedVisitedDate,
        });

        await travelstory.save();
        return res.status(200).json({story:travelstory,message:"Added Successfully"});
    } catch (error) {
        res.status(400).json({error:true,message:error.message});
    }
})

// Get All stories
app.get("/get-all-stories",authenticationToken,async (req,res)=>{
   const {userId} = req.user;

   try {
    const travelstories = await TravelStory.find({userId:userId}).sort({isFavourite:-1,})
    res.status(200).json({stories:travelstories});
   } catch (error) {
    res.status(500).json({error:true , message:error.message});
   }
})

// edit story
app.put("/edit-story/:id",authenticationToken,async (req,res)=>{
    const {id} = req.params;
    const {title,story,visitedLocation,imageUrl,visitedDate} = req.body;
    const {userId} = req.user;

    if(!title || !story || !visitedLocation || !visitedDate){
        return res.status(400).json({error:true,message:"All fields are required"});
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelstory = await TravelStory.findOne({_id:id,userId:userId});

        if(!travelstory){
            return res.status(400).json({error:true , message:"Travel story not found"});
        }

        const placeHolderImgUrl = "http://localhost:8000/assets/placeholder.png";

        travelstory.title = title;
        travelstory.story = story;
        travelstory.visitedLocation = visitedLocation;
        travelstory.imageUrl = imageUrl || placeHolderImgUrl;
        travelstory.visitedDate = parsedVisitedDate;

        await travelstory.save();
        res.status(200).json({story:travelstory , message:"Update successful"});
    } catch (error) {
        res.status(500).json({error:true , message:error.message});
    }
})

// Delete story
app.delete("/delete-story/:id",authenticationToken,async (req,res)=>{
    const {id} = req.params;
    const {userId} = req.user;

    try {
        const travelstory = await TravelStory.findOne({_id:id,userId:userId});

        if(!travelstory){
            return res.status(404).json({error:true , message:"Travel story not found"});
        }

        // delete the travel story from database
        await travelstory.deleteOne({_id:id , userId:userId});

        // Extract the filename from imageUrl
        const imageUrl = travelstory.imageUrl;
        const filename = path.basename(imageUrl);

        // define the filepath
        const filePath = path.join("uploads",filename);

        // delete the image file from the uploads folder
        fs.unlink(filePath,(err)=>{
            if(err){
                console.error("Failed to delete the image file:",err);   
            }
        });

        res.status(200).json({message:"Travel story deleted successfully"});
    } catch (error) {
        res.status(500).json({error:true , message:error.message});
    }
})

// Edit isFavourite
app.put("/update-is-favourite/:id",authenticationToken,async (req,res)=>{
    const {id} = req.params;
    const {isFavourite} = req.body;
    const {userId} = req.user;

    try {
        const travelstory = await TravelStory.findOne({_id:id,userId:userId});

        if(!travelstory){
            return res.status(404).json({error:true , message:"Travel story not found"});
        }

        travelstory.isFavourite = isFavourite;
        await travelstory.save();
        res.status(200).json({story:travelstory , message:"Updated successfully"})
    } catch (error) {
        res.status(500).json({error:true , message:error.message});
    }
})

// Search travel Stories
app.get("/search",authenticationToken,async (req,res)=>{
    const {query} = req.query;
    const {userId} = req.user;

    if(!query){
        return res.status(404).json({error:true , message:"query is required"});
    }

    try {
        const searchResult = await TravelStory.find({
            userId:userId,
            $or:[
                {title:{$regex:query , $options:"i"}},
                {story:{$regex:query , $options:"i"}},
                {visitedLocation:{$regex:query , $options:"i"}}
            ],
        }).sort({isFavourite:-1});

        res.status(200).json({stories:searchResult});
    } catch (error) {
        res.status(500).json({error:true , message:error.message});
    }
})

// Filter travel stories by date range
app.get("/travel-stories/filter",authenticationToken,async (req,res)=>{
    const {startDate,endDate} = req.query;
    const {userId} = req.user;

    try {
        // Convert start date and end date from milliseconds to date object
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        // find travel story that belong to authentcated user and fall under date range
        const filteredStories = await TravelStory.find({
            userId:userId,
            visitedDate:{$gte:start ,$lte:end},
        }).sort({isFavourite:-1});

        res.status(200).json({stories:filteredStories});
    } catch (error) {
        res.status(500).json({error:true , message:error.message});
    }
})
app.listen(8000,()=>{
    console.log("The server is running on port 8000")
});
export default app;