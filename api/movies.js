import MoviesModel from "../models/movies.js";

export const addMovie= async(req,res)=>{
    const {title, description,runtime,year,genre, DirectedBy, cast  }=req.body;
    const exists=await MoviesModel.findOne({title});
    if(exists){
        return res.status(404).json({message:"exists"});
    }
    const movie= await MoviesModel({title, description,runtime,year,genre, DirectedBy, cast});
    await movie.save();
    return res.status(200).json({movie, message:"successs"});
}

export const searchMovie= async(req,res)=>{
    const {  genre, cast, title }=req.params;

    const movies=await MoviesModel.find({genre :{$in :[genre]}});
     movies+=await MoviesModel.find({cast :{$in :[cast]}});
     movies+=await MoviesModel.find({title :{$regex :title, $options:i}});

    return res.status(200).json({movies, message:"successs"});
}


