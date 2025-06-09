import Log from "../models/log.js"
import MoviesModel from "../models/movies.js";

export const addLog=async(req,res)=>{
    const {userId, sourceModel, logSourceId, logTitle, liked, rating, review, tags  }=req.body;
    
    return res.status(200).json({log, message:"success"});
}