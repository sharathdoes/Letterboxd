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
  try {
    const { genre, cast, title } = req.body;

    const orConditions = [];

    genre?.length && orConditions.push({ genre: { $in: genre } });
    cast?.length && orConditions.push({ cast: { $in: cast } });
    title && orConditions.push({ title: { $regex: title, $options: "i" } });

    const movies = orConditions.length
      ? await MoviesModel.find({ $or: orConditions })
      : await MoviesModel.find({}); // fallback: return all

    return res.status(200).json({ movies, message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
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
    $or: [
      { runtime: { $gte: 120, $lte: 180 } },
      { year: { $gte: SixYearsAgo } }
    ]
  });
  const movies_by_descending_order = await MoviesModel.find()
    .sort({ year: -1 })
    .limit(5);

  return res.status(200).json({
    top_5_liked_and_rated,
    count_movies_nolan,
    movies_after_2015,
    movies_released_last_6years,
    movies_btw_120_180_duration,
    movies_by_descending_order,
    message: "success",
  });
};

export const leastliked = async (req, res) => {
  const movies = await MoviesModel.find().sort({ AvgRating: 1 }).limit(5);
  return res.status(200).json(movies);
};
