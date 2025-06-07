import User from "../models/user";

export const register= async( req,res)=>{
    const {username, password}=req.body;

    if(!username || !password){
        return res.status(400).json({message:"enter proper credentials bro"});
    }
}