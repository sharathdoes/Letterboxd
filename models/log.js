import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sourceModel: {
    type: String,
    required: true,
    enum: ['Movie', 'Series']
  },
  logSource: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'sourceModel'
  },
  logTitle: String,
  liked:    Boolean,
  rating:   Number,
  review:   String,
  tags:     [String]
}, { timestamps: true });

export default mongoose.model('Log', LogSchema);
