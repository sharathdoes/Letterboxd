import MoviesModel from "../models/movies.js";

export const addMovie= async(req,res)=>{
    const {title, description,runtime,year,genre, DirectedBy, cast  }=req.body;
    const movie= await MoviesModel({title, description,runtime,year,genre, DirectedBy, cast});
    await movie.save();
    return res.status(200).json({movie, message:"successs"});
}