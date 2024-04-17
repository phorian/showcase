const User = require("../models/User");


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

}
 



exports.resetPassword = (req, res, next) => {

}