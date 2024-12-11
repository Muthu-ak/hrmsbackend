const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) =>{
    let authorization = req.headers['authorization'];

    if(authorization && authorization != null){
        let token = authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decode)=>{
            if(err) return res.status(401).json({'msg':'Access denied'});
            req.body.userDetails = decode;
            next();
        });
    }
    else{
       return res.status(401).json({'msg':'Access Denied'});
    }
   
}

module.exports = authMiddleware;