import SeriesModel from "../models/series.js"

export const addSeries=async( req,res)=>{
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
      const exists = await SeriesModel.findOne({ title });
      if (exists) {
        return res.status(404).json({ message: "exists" });
      }
      const series = await SeriesModel({
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
      await series.save();
      return res.status(200).json({ series, message: "successs" });
}