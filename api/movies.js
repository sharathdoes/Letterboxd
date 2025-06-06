import MoviesModel from "../models/movies.js";

export const getMovies = async (req, res) => {
    try {
        const movies = await MoviesModel.find();
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const addMovie=async(req,res)=>{
    console.log("🔥 DEBUG: Hit addMovie");
    console.log("🔥 DEBUG: Headers =>", req.headers);
    console.log("🔥 DEBUG: Body =>", req.body);
    if(!req.body.title || !req.body.description || !req.body.runtime){
        return res.status(500).json({message:"no proper data"})
    }
    console.log(req.body);
    const {title, description, runtime}=req.body;
    let m={title, description, runtime};
    const movie= new MoviesModel(m);
    await movie.save();
    return res.status(200).json(movie);
}