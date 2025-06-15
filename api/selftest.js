import MoviesModel from "../models/movies.js";
import SeriesModel from "../models/series.js"
import Log from "../models/log.js";
import User from "../models/user.js"

// API 1 
/*Description:
You need to return a mixed feed of:

Latest 10 reviews (from any user)

Top 5 trending movies (highest AvgRating)

Top 5 trending series (highest likesCount) */

export const Mixed_feed=async(req,res)=>{
    try{
        const logs=await Log.find().select('logTitle review rating tags').sort({createdAt:-1}).limit(10);
        const movies=await MoviesModel.find().sort({AvgRating:-1, likesCount:-1}).limit(5);
        const series=await SeriesModel.find().sort({AvgRating:-1, likesCount:-1}).limit(5);

        return res.status(200).json({message:"success", logs, movies, series});
    }
    catch(err){
        return res.status(400).json({message:"error", err});
    }
}

/*API 2 
Logic:
For given user, fetch top 3 genres (based on his logs & reviews)

Recommend movies and series that match those genres, excluding already watched content.

Exclude movies/series the user has already logged/reviewed.*/

export const Recommend=async(req,res)=>{
    try{
        const {id}=req.user;
        const hisfavorite_genres=await MoviesModel.find({userId:id}).select('genre').sort({AvgRating:-1}).limit(5);
        const genre_maps=hisfavorite_genres.flatMap(movie => movie.genre).filter(Boolean);
        const recc_movies=await MoviesModel.find({genre:{$in: genre_maps}}).populate('logs');
        let reccs=[];
        for(const movie of recc_movies){
            var flag=false;
            for(const log of movie.logs){
                if (log.userId.toString() === id.toString()){
                    flag=true;
                    break;
                }
            }
            if(!flag)
            reccs.push(movie);
        }
        return res.status(200).json({message:"success", reccs});   
    }
    catch(err){
        return res.status(400).json({message:"error", err});
    } 
}

/** API 3
 Logic:
Allow user to update rating or comment.

When rating changes:

Subtract old rating from movie's AvgRating.

Add new rating.

Recalculate AvgRating properly.

If only comment changes, don’t touch rating.
 */

export const Log_update = async( req,res )=>{
    try{
        const {id, logId, rating, logTitle, review, liked}=req.params;
        const log=await Log.findById({id:logId});
      
        

        if(review){
            log.review=review;
        }


        if(log.sourceModel==='Movie'){
            const movie=await MoviesModel.findById(log.logSourceId);
            const movielogs=await Log.countDocuments({logSourceId:log.logSourceId});
            const totalsumrating=movie.AvgRating*movielogs;
            const new_rating=totalsumrating-log.rating+rating/movielogs;
            movie.AvgRating=new_rating;
            
            if(!log.liked&&liked){
                movie.likes+=1;
                log.liked=true;
            }
            else if(log.liked&&!liked){
                movie.likes-=1;
                log.liked=false;
            }
            await movie.save();
        }

        if(logTitle){
            log.logTitle=logTitle;
        }
        if(rating){
            log.rating=rating
        }


        await log.save();

        return res.status(200).json({message:"successs"});

    }
    catch(err){
        return res.status(400).json({message:"error", err});
    } 
}