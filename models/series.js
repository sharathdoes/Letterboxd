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
  AvgRating: {type:Number, default:0},
  likesCount: {type:Number, default:0},
  genre: [String],
  DirectedBy: String,
  cast: [String],
  logs: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Log" 
  }]
}, { timestamps: true });

const SeriesModel = mongoose.model("Series", SeriesSchema);
export default SeriesModel;
