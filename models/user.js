import mongoose from "mongoose";

import {z} from "zod"

export const userSignupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    logs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Log"
    }]
})



const User= mongoose.model("user", UserSchema)
export default User