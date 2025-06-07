import Log from "../models/log.js"

export const addLog=async(req,res)=>{
    const {userId, sourceModel, logSourceId, lotTitle, liked, rating, review, tags  }=req.body;
    const log = await Log({userId, sourceModel, logSourceId, lotTitle, liked, rating, review, tags });
    await log.save();
    return res.status(200).json({log, message:"success"});
}