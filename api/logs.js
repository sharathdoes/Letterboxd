import Log from "../models/log.js";
import MoviesModel from "../models/movies.js";
import SeriesModel from "../models/series.js";

export const addLog = async (req, res) => {
  const {
    userId,
    sourceModel,
    logSourceId,
    logTitle,
    liked,
    rating,
    review,
    tags,
  } = req.body;

  const result = new Log({
    userId,
    sourceModel,
    logSourceId,
    logTitle,
    liked,
    rating,
    review,
    tags,
  });
  await result.save();
  if (sourceModel == "Movie") {
    const movie = await MoviesModel.findById(logSourceId);
    if (liked) {
      movie.likesCount += 1;
    }
    if (rating) {
      const totallogs = movie.logs.length;
      const totalsofar = movie.AvgRating * totallogs;
      movie.AvgRating = (totalsofar + rating) / (totallogs + 1);
    }
    movie.logs.push(result._id);
    await movie.save();
  } else if (sourceModel === "Series") {
    const series = await SeriesModel.findById(logSourceId);
    if (liked) {
      series.likesCount += 1;
    }
    if (rating) {
      const totallogs = series.logs.length;
      const totalsofar = series.AvgRating * totallogs;
      series.AvgRating = (totalsofar + rating) / (totallogs + 1);
    }
    series.logs.push(result._id);
    await series.save();
  }
  return res.status(200).json({ result, message: "success" });
};


export const deletelog = async (req, res) => {
    try {
      const { id } = req.user;
      const { logId } = req.body;
  
      const log = await Log.findById(logId);
      if (!log) return res.status(404).json({ message: "Log not found" });
  
      if (log.userId.toString() !== id.toString()) {
        return res.status(403).json({ message: "It ain't yours" });
      }
  
      const rating = log.rating || 0;
  
      if (log.sourceModel === "Movie") {
        const movie = await MoviesModel.findById(log.logSourceId);
        if (!movie) return res.status(404).json({ message: "Movie not found" });
  
        if (log.liked) {
          movie.likesCount = Math.max(0, movie.likesCount - 1);
        }
  
        const totallogs = movie.logs.length;
        const totalrating = totallogs * movie.AvgRating;
  
        movie.AvgRating =
          totallogs > 1 ? (totalrating - rating) / (totallogs - 1) : 0;
  
        movie.logs = movie.logs.filter(
          (logIdInMovie) => logIdInMovie.toString() !== logId
        );
  
        await movie.save();
      } else if (log.sourceModel === "Series") {
        const series = await SeriesModel.findById(log.logSourceId);
        if (!series) return res.status(404).json({ message: "Series not found" });
  
        if (log.liked) {
          series.likesCount = Math.max(0, series.likesCount - 1);
        }
  
        const totallogs = series.logs.length;
        const totalrating = totallogs * series.AvgRating;
  
        series.AvgRating =
          totallogs > 1 ? (totalrating - rating) / (totallogs - 1) : 0;
  
        series.logs = series.logs.filter(
          (logIdInSeries) => logIdInSeries.toString() !== logId
        );
  
        await series.save();
      }
  
      await Log.findByIdAndDelete(logId);
  
      return res.status(200).json({ message: "success" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  };
  