import mongoose from "mongoose";

const LogSchema=new mongoose.Schema({

    logSource: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'sourceModel'
      },
      sourceModel: {
        type: String,
        required: true,
        enum: ['Movies', 'Series']
      },
    logtitle:{
        type:String,
    },
    liked:{
        type:Boolean,
    },
    isSeries:{
        type:Boolean,
    },
    isMovie:{
        type:Boolean,
    },
    rating:{
        type:Number
    },
    review:{
        type:String
    },
    tags:{
        type:[String]
    }
})

const Log= mongoose.model("logs", LogSchema)
export default Log