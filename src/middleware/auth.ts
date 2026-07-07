import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try{
        const authHeader = req.headers.authorization;
        if(authHeader == undefined){
        return res.status(401).json({error: 'Токен не предоставлен'})
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        req.userId = decoded.userId;
        next();

    }catch(err){
        console.log(err)
        res.status(401).json({error:'Невалидный токен'})
    }

}

export default authMiddleware;

