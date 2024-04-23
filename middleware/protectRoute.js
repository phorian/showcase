const jwt = require('jsonwebtoken')
const util = require('util');
const User = require("../models/User");


exports.verifyJWT = async (req, res, next) => {
    // Read the token & check if it exists

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    // Validate Token
    
    const decodedToken = await util.promisify(jwt.verify)(
        token,
        process.env.ACCESS_TOKEN_SECRET);
    
    // Confirm user exists

    const user = await User.findById(decodedToken.id)

    if(!user){
        return res.sendStatus(401); //invalid token
        //next()
    }

    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
    // Verify for changed password after token was issued
    if (isPasswordChanged) {
        return  next(res.status(401).json("Your password was changed, Please login again"));
        // next();
    }


    // Allow user access route
    req.user = user;
    next();
}


exports.verifyRole = (...role) => {
    return (req, res, next) => {
    if(!role.includes(req.user.role)){
        res.status(401).json("You are unable to perform this action");
        next();
    }
    next();
}

    /*let { username } = req.body;
    
    const user = await User.findOne({ username });
    !role.includes(user.role)
    ? res.status(401).json("Sorry you do not have access to this route") : next();*/
    
    };
    








/*const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.username = decoded.username;
            req.role = decoded.role;
            next();
        })
}

module.exports = verifyJWT
*/