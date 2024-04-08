const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userLogin = async (req, role, res) => {
    const {username, password} = req.body;

    //Username and password input check
    if( !username || !password ) {
        return res.status(400).json({'message': 'Input Username and Passrowd'});
    }

    //Check if user exists
    const searchUser = await User.findOne({username: username}).exec();
    if(!searchUser) {
        return res.sendStatus(401); 
    }

    //Check user role and route used
    if(searchUser.role !== role) {
        return res.status(403).json({
            message: "Please Make sure you are signing in from the right Entry",
            success: false,
        });
    }

    //Check password input
    const matchpwd = await bcrypt.compare(password, searchUser.password)
    if (matchpwd) {
       //Sign a token and issue to user if password match
       const accessToken = jwt.sign(
        {
            "username": searchUser.username,
            "email": searchUser.email,
            "role": searchUser.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '300s'}
       );

       const refreshToken = jwt.sign (
        {
            "username": searchUser.username,
            "email": searchUser.email, 
            "role": searchUser.role
              
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1D'}
       );

       //Save refreshToken with current user
       searchUser.refreshToken = refreshToken;
       const result = await searchUser.save();
       console.log(result);
       res.json({ accessToken });
       return res.status(200).json({
        ...result, 
        message: "You are logged in.",
       })
        
    } else {
        return res.status(403).json({
            message: "Incorrect password."
        });
    }
}

module.exports = {userLogin}