import User from "../models/user.js";
import Log from "../models/log.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
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
        const {username, email, password}=req.body;

        if(!email||!username || !password){
            return res.status(400).json({message:"enter proper credentials bro"});
        }
    
        const user= await User.findOne({username:username});
    
        if(user){
            return res.status(401).json( { message:"Already a user exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newuser=new User({email, username,password:hashedPassword});

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

