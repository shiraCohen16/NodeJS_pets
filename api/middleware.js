const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

const authenticateJWT = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    const x = authHeader.split(' ');
    if(authHeader && x[0] =='Bearer'){
        console.log("fdfd");
        const token = authHeader.split(' ')[1];
        jwt.verify(token , JWT_SECRET , (err,user)=>{
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        })
    }else{
        res.sendStatus(401);
    }
}
module.exports = authenticateJWT;