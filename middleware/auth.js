const jwt = require('jsonwebtoken');


function authMiddleware(req, res, next) {
    try{
        const authHeader = req.headers.authorization;
        if(authHeader == undefined){
        return res.status(401).json({error: 'Токен не предоставлен'})
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();

    }catch(err){
        console.log(err)
        res.status(401).json({error:'Невалидный токен'})
    }

}

module.exports = authMiddleware;

