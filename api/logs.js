import Log from "../models/log.js"
import MoviesModel from "../models/movies.js";
import SeriesModel from "../models/series.js"

export const addLog=async(req,res)=>{
    const {userId, sourceModel, logSourceId, logTitle, liked, rating, review, tags  }=req.body;
    
    const result=new Log({userId, sourceModel, logSourceId, logTitle, liked, rating, review, tags  });
    await result.save();
    if(sourceModel=='Movie'){
        const movie= await MoviesModel.findById(logSourceId);
        if(liked){
            movie.likesCount+=1;
        }
        if(rating){
            const totallogs=movie.logs.length;
            const totalsofar=movie.AvgRating*totallogs
            movie.AvgRating=(totalsofar+rating)/(totallogs+1)
        }
        movie.logs.push(result._id)
        await movie.save();
    }
    else if(sourceModel==='Series'){
        const series=await SeriesModel.findById(logSourceId);
        if(liked){
            series.likesCount+=1;
        }
        if(rating){
            const totallogs=series.logs.length;
            const totalsofar=series.AvgRating*totallogs
            series.AvgRating=(totalsofar+rating)/(totallogs+1)
        }
        series.logs.push(result._id);
        await series.save();
    }
    return res.status(200).json({result, message:"success"});
}

export const deletelog=async()=>{
    const {id}=req.user;
    const 
}