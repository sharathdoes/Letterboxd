import User from "../models/user.js";
import Log from "../models/log.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import SeriesModel from "../models/series.js";
import MoviesModel from "../models/movies.js";
import { Logs } from "lucide-react";
export const login= async( req,res)=>{
    try{
        const {username, password}=req.body;

        if(!username || !password){
            return res.status(400).json({message:"enter proper credentials bro"});
        }
    
        const user=await User.findOne({username:username});
    
        if(!user){
            return res.status(401).json({message:"you didn't sign up brother"});
        }
    
        const authorized= await bcrypt.compare(password,user.password);
        if(authorized){
            console.log("here")
            const token= jwt.sign( {id:user._id},process.env.JWT_SECRET, {expiresIn:'3d'})
            console
            return res.status(200).json({token, message:"login successful"});
        }
        else{
            return res.status(401).json({token, message:"login unsuccessful, Incorrect password"});
        }
    }
    catch(err){
        return res.status(404).json({message:err});
    }
   
}

export const register= async( req,res)=>{
    try{
        const validatedData = userSignupSchema.parse(req.body);
    
        const existingUser = await User.findOne({
        $or: [
            { username: validatedData.username },
            { email: validatedData.email }
        ]
        });
    
         if (existingUser) {
        return res.status(409).json({ 
            message: "User with this username or email already exists" 
        });
        }

        const hashedPassword=await bcrypt.hash(validatedData.password,10);

        const newuser=new User({email:validatedData.email, username:validatedData.username,password:hashedPassword});

        await newuser.save();

        return res.status(200).json({newuser, message:"Registraion Successful"});
        
    }
    catch(err){
        return res.status(404).json({message:err});
    }
   
}


export const mylogs= async( req,res)=>{
    try{
        const {id}=req.user;
        console.log(id)
        const userId=id;
        if(!userId ){
            return res.status(400).json({message:"send credentials bro"});
        }
    
        const logs= await Log.find({userId});
    
        return res.status(200).json({logs, message:"success"});
        
    }
    catch(err){
        return res.status(404).json({message:err});
    }
   
}


export const reccs=async(req,res)=>{
    const {id}=req.user;

    const top_movie_logs= await Log.find({userId:id, sourceModel:"Movie"}).sort({rating:-1}).limit(5);
    const top_series_logs= await Log.find({userId:id, sourceModel:"Series"}).sort({rating:-1}).limit(5);

    const those_movies_ids_movies= top_movie_logs.map(log=>log.logSourceId);
    const those_movies_ids_series= top_series_logs.map(log=>log.logSourceId);

    const series_i_like=await SeriesModel.find({_id : {$in :those_movies_ids_movies}})
    const movies_i_like=await MoviesModel.find({_id : {$in : those_movies_ids_series}})

    let fav_genre_movies=movies_i_like.map(log=>log.genre).flat().filter(Boolean);
    let fav_genre_series=series_i_like.map(log=>log.genre).flat().filter(Boolean);



    let recc_movies=await MoviesModel.find({genre : {$in: fav_genre_movies}, _id :{$nin : those_movies_ids_movies}});

    let recc_series=await SeriesModel.find({genre : {$in: fav_genre_series},  _id :{$nin : those_movies_ids_series}})

    return res.status(200).json({recc_movies, recc_series})


}


export const myactivity =async(req,res)=>{
    const {id}=req.user;

    const recent_logs=await Log.find({userId:id}).sort({createdAt:-1}).limit(10);
    const popular_reviews= await Log.find({userId:id}).sort({likes:-1}).limit(10);
    const total_number_of_movies=await Log.countDocuments({userId : id, sourceModel:"Movie"})
    const total_number_of_series=await Log.countDocuments({userId : id, sourceModel:"Series"})
    const currentyear=new Date();
    currentyear.setFullYear(currentyear.getFullYear()-1);
    const total_movies_this_year=await Log.countDocuments({$and:{userId : id, sourceModel:"Movie", createdAt:{$gte: currentyear}}})
    const ratings_graph_from_0_to_5=[await Log.countDocuments({userId:id ,rating:0}),await Log.countDocuments({userId:id ,rating:1}),await Log.countDocuments({userId:id ,rating:2}),await Log.countDocuments({userId:id ,rating:3}),await Log.countDocuments({userId:id ,rating:4}),await Log.countDocuments({userId:id ,rating:5})]
    const my_tags_used=(await Log.find({userId:id})).map(log=>log.tags).flat().filter(Boolean);

    return res.status(200).json({recent_logs, popular_reviews, total_movies_this_year, total_number_of_series, my_tags_used, total_number_of_movies, ratings_graph_from_0_to_5})
}