const User = require("../models/User");
const sendEmail = require('../../utils/email');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


exports.forgotPassword = async (req, res, next) => {
    
    //Get user via email submitted
    const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.status(404).json("This user does not exist");
    }
    
    //Generate a reset token {random}

    const resetToken = user.createResetPasswordToken();

    await user.save({validateBeforeSave: false});


    //send email to user with reset token
    const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
    
    const message = `We have received a password request. Please use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid for 10 minutes`
    
    try{

        await sendEmail({
            email: user.email,
            subject: 'Password change request',
            message: message
    
    });

    res.status(200).json({
        status: 'success',
        'message': 'Password reset link sent to user email'
    })
    }catch(err){
        user.password = undefined;
        user.passwordResetTokenExp = undefined,
        user.save({validateBeforeSave: false});

        return  res.status(500).json({'message': err.message})
    }


}

exports.resetPassword = async (req, res, next) => {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken: token, passwordResetTokenExp:{$gt: Date.now()}});
    

    if(!user){
        return  res.status(400).json({'message': 'Token is Invalid or expired'});
        //next();
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExp = undefined;
    user.passwordChangedAt = Date.now();

    user.save();


    const logintoken = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        })

        res.status(200).json({
            status: 'success',
            logintoken
        });
}