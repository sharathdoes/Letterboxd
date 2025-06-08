import Log from "../models/log.js"
import MoviesModel from "../models/movies.js";

export const addLog=async(req,res)=>{
    const {userId, sourceModel, logSourceId, logTitle, liked, rating, review, tags  }=req.body;
    const log = await Log({userId, sourceModel, logSourceId, logTitle, liked, rating, review, tags });
    const movie= await MoviesModel.findbyId(logSourceId);
    if(liked)
    movie.likes+=1;

    const totalLogs = await Log.find({ logSourceId });
    const ratings = totalLogs.map(l => l.rating || 0);
    const newAvg = (ratings.reduce((a, b) => a + b, 0) + rating) / (ratings.length + 1);

    movie.AvgRating = parseFloat(newAvg.toFixed(2));
    await movie.save();
    await log.save();
    return res.status(200).json({log, message:"success"});
}