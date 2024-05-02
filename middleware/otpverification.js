const verifyOtp = (req, res, next) => {
    const {enteredOtp} = req.body;
    const storedOtp = req.user.otp;

    if(enteredOtp !== storedOtp) {
        return res.status(400).json({message: 'Invalid OTP. Please try again'});
    
    }
    next();
}

module.exports = verifyOtp;