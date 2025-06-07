import mongoose from 'mongoose';

const MoviesSchema = new mongoose.Schema({
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
  cast: [String],
  logs: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: "logs" 
  }]
}, { timestamps: true });

const MoviesModel = mongoose.model("Movies", MoviesSchema);
export default MoviesModel;
