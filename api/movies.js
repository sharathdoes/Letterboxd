import MoviesModel from "../models/movies.js";

export const addMovie = async (req, res) => {
  const {
    title,
    AvgRating,
    likesCount,
    description,
    runtime,
    year,
    genre,
    DirectedBy,
    cast,
  } = req.body;
  const exists = await MoviesModel.findOne({ title });
  if (exists) {
    return res.status(404).json({ message: "exists" });
  }
  const movie = await MoviesModel({
    title,
    description,
    runtime,
    year,
    genre,
    DirectedBy,
    cast,
    AvgRating,
    likesCount,
  });
  await movie.save();
  return res.status(200).json({ movie, message: "successs" });
};

export const searchMovie = async (req, res) => {
  const { genre, cast, title } = req.body;
  let movies = [];
  if (genre) {
    for (var i = 0; i < genre.length; i++)
      movies = movies.concat(
        await MoviesModel.find({ genre: { $in: [genre[i]] } })
      );
  }
  
  if (cast)
    for (var i = 0; i < cast.length; i++)
      movies = movies.concat(
        await MoviesModel.find({ cast: { $in: [cast[i]] } })
      );

  if (title)
    movies = movies.concat(
      await MoviesModel.find({ title: { $regex: title, $options: "i" } })
    );

  return res.status(200).json({ movies, message: "success" });
};

export const searchMovieByKey = async (req, res) => {
  const { query } = req.body;
  const movies = await MoviesModel.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { DirectedBy: { $regex: query, $options: "i" } },
      { genre: { $in: [query] } },
      { cast: { $in: [query] } },
    ],
  });
  return res.status(200).json({ movies, message: "success" });
};
export const stats = async (req, res) => {
  const top_5_liked_and_rated = await MoviesModel.find()
    .sort({ likesCount: -1, AvgRating: -1 })
    .limit(5);
  const count_movies_nolan = await MoviesModel.countDocuments({
    DirectedBy: "Christopher Nolan",
  });
  const movies_after_2015 = await MoviesModel.find({
    year: { $gte: new Date("2015-01-01") },
  });
  const SixYearsAgo = new Date();
  SixYearsAgo.setFullYear(SixYearsAgo.getFullYear() - 6);
  const movies_released_last_6years = await MoviesModel.find({
    year: { $gte: SixYearsAgo },
  });
  const movies_btw_120_180_duration = await MoviesModel.find({
    $and: [{ runtime: { $gte: 120 } }, { runtime: { $lte: 180 } }],
  });
  const movies_by_descending_order = await MoviesModel.find()
    .sort({ year: -1 })
    .limit(5);

  return res
    .status(200)
    .json({
      top_5_liked_and_rated,
      count_movies_nolan,
      movies_after_2015,
      movies_released_last_6years,
      movies_btw_120_180_duration,
      movies_by_descending_order,
      message: "success",
    });
};

const leastliked=async(req,res)=>{
  const movies=await MoviesModel.find().sort({AvgRating:1}).limit(5);
  return res.status(200).json(movies);
}