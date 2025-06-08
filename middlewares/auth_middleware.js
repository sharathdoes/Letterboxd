import jwt from "jsonwebtoken"

export const auth_middleware=async(req,res, next)=>{
    const auth_token=req.headers.authorization;
    const token = auth_token.split(" ")[1];
    const decoded=jwt.verify(token, process.env.JWT_SECRET);
    req.user=decoded;
    next();

}