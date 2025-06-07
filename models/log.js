import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sourceModel: {
    type: String,
    required: true,
    enum: ['Movie', 'Series']
  },
  logSourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'sourceModel'
  },
  logTitle: String,
  liked:    Boolean,
  rating:   {type:Number, default:0},
  review:   String,
  tags:     [String]
}, { timestamps: true });

export default mongoose.model('Log', LogSchema);
