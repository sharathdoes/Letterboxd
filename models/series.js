import mongoose from 'mongoose';

const SeriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  runtime: Number,
  year: Date,
  AvgRating: Number,
  likesCount: Number,
  genre: [String],
  DirectedBy: String,
  cast: [String]
}, { timestamps: true });

const SeriesModel = mongoose.model("Series", SeriesSchema);
export default SeriesModel;
