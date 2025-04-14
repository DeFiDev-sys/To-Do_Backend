import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'


const getTokenFromHeader = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    return authHeader?.startsWith('Bearer') ? authHeader.split(' ')[1] : null;
};

const authMiddleWare = (req:Request , res:Response, next:NextFunction) =>{
    const token = getTokenFromHeader(req) || req.cookies?.token;
    if(!token){
        res.status(401).json({message:"Unauthorized"})
        return;
    }

    try {
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET!) as jwt.JwtPayload
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({message : "Invalid token"})
    }
}

export default authMiddleWare