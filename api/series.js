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

import Log from "../models/log.js";

export const trendingFromLastWeek = async (req, res) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Get logs from last 7 days for series only
    const recentLogs = await Log.find({
      sourceModel: 'Series',
      createdAt: { $gte: lastWeek }
    });

    // Count logs per series
    const countMap = {}; // { seriesId: count }
    for (const log of recentLogs) {
      const id = log.logSourceId.toString();
      countMap[id] = (countMap[id] || 0) + 1;
    }

    // Convert map to array and sort descending
    const sortedTrending = Object.entries(countMap)
      .sort((a, b) => b[1] - a[1]) // descending by log count
      .slice(0, 5); // Top 5 trending series

    // Fetch full series details
    const trendingSeries = await SeriesModel.find({
      _id: { $in: sortedTrending.map(([id]) => id) }
    });

    return res.status(200).json({
      trending: trendingSeries,
      message: "Trending Series from Last 7 Days"
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
