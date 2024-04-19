const User = require("../models/User");
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createNewUser = async (req, res, next) => {
    const {username, firstname, lastname, password, email} = req.body;

    //check if username or password has been input
    if(!username || !password || !email || !firstname || !lastname) {
        return res.status(400).json({'message': 'Input all fields'})
    }

    //check for duplicate email in the db
    const duplicateEmail = await User.findOne({email: email}).exec();
    if(duplicateEmail)
    return res.sendStatus(409); //conflict

     //check for duplicate username in the db
     const duplicateUsername = await User.findOne({username: username}).exec();
     if(duplicateUsername)
     return res.sendStatus(409); //conflict

    //check password length
    if (password.length < 6) {
        return res.status(400).json({message: "Password less than 6 characters"})
    }

    try {
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

        //console.log(newUser)

        const token = jwt.sign({id: newUser._id}, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        })

        res.status(200).json({
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