const User = require("../models/User");
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateOtp = require('../utils/otpGenerator');
const sendEmail = require('../utils/smtp');

exports.createNewUser = async (req, res, next) => {
    const {username, firstname, lastname, password, email, city, phone, address, role, otp} = req.body;

    //check if username or password has been input
    if(!username || !password || !email || !firstname || !lastname || !city || !phone || !address || !role) {
        return res.status(400).json({message: 'Input all fields'});
    }

    //check for duplicate email in the db
    const duplicateEmail = await User.findOne({email: email}).exec();
    if(duplicateEmail)
    return res.status(400).json({ status: false, message: 'Email already exists'}); //conflict --> Existing email

     //check for duplicate username in the db
     const duplicateUsername = await User.findOne({username: username}).exec();
     if(duplicateUsername)
     return res.status(400).json({ status: false, message: 'User already exists'}); //conflict --> Existing Username

    //check password length
    if (password.length < 6) {
        return res.status(400).json({message: "Password less than 6 characters"})
    }

    try {

        //Generate OTP
        const otp = generateOtp();
        //create and store the new user
        const newUser = await User.create(
            req.body,

            /*"username": username,
            "firstname": firstname,
            "lastname": lastname,
            "password": hashedpwd,
            "email": email,
            role*/

        );

        //Send OTP to email
        await sendEmail({
            email: newUser.email,
            subject: 'Verification OTP',
            message: otp
        });

        const token = jwt.sign({id: newUser._id}, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        })

        res.status(201).json({
            status: 'success',
            token,
            data: {
                newUser,
            },
        });

    } catch (err){
        res.status(500).json({'message': err.message})
    }
}

//module.exports = {createNewUser}