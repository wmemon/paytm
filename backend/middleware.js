const jwt = require('jsonwebtoken');
const JWT_SECRET = require('./config');
const {User} = require('../db');
const authMiddleware =  async (req,res,next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return(
            res.status(403).json({
                message: "Invalid User ID"
            })
        )
    }
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        const userIdChecked = await User.findById(userId);
        if(!userIdChecked){
            return(
                res.status(403).json({
                    message: "Invalid User ID"
                })
            )
        }
    
        if(userIdChecked){
            req.userId = userIdChecked;
            next();
        }
    } catch(err){
            console.log(err);
            return(
                res.status(403).json({
                    message: "Invalid User ID"
                })
            )
    }   

}

module.exports = authMiddleware;