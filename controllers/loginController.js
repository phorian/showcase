const User = require("../models/User");
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//JWT Sign function ----> Reusable

const signToken = id => {

     return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        })
}

const userLogin = async (req, res) => {
    const {email, password} = req.body;

    //Username and password input check
    if( !email || !password ) {
        return res.status(400).json({'message': 'Input Username and Password'});
    }

    //Check if user exists
    const searchUser = await User.findOne({ email }).select('+password');
    if(!searchUser) {
        return res.status(400).json({status: false, message: 'User not found'}); 
    }

    /* Check user role and route used
    if(searchUser.role !== role) {
        return res.status(403).json({
            message: "Please Make sure you are signing in from the right Entry",
            success: false,
        });
    }*/

    //Check password input
    const matchpwd = await searchUser.matchPassword(password, searchUser.password)
    if (matchpwd) {
       //Sign a token and issue to user if password match

       const accessToken = signToken(searchUser._id);
       
       
       /*jwt.sign(
        {
            "username": searchUser.username,
            "email": searchUser.email,
            "role": searchUser.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '300s'}
       ); */

       /*const refreshToken = jwt.sign ( 
        {
            "username": searchUser.username,
            "email": searchUser.email, 
            "role": searchUser.role
              
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1D'}
       );*/

       //Save refreshToken with current user
       //searchUser.refreshToken = refreshToken;

       const result = await searchUser.save();
       //console.log(result);
       return res.status(200).json({
        status: 'success',
        accessToken,
        message: "You are logged in.",
        data: {
            result
        }
       })
        
    } else {
        return res.status(403).json({
            message: "Incorrect password."
        });
    }
}

module.exports = {userLogin}