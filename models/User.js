const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new Schema ({
    username: {
        type: String,
        unique: true,
        required: [true, 'Please enter your username.']
    },
    firstname: {
        type: String,
        required: [true, 'Please enter your firstname.']
    },
    lastname: {
        type: String,
        required: [true, 'Please enter your lastname.']
    },
    role: {
        type: String,
        enum: [ "User", "Brand", "Vendor"],
        default: 'User',
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, 'Please enter password'],
        select: false
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter email.'],
        lowercase: true,
        validate: [ validator.isEmail, 'Please enter a valid email.']
    },
    city: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExp: Date
},
    {timestamps: true},

);

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    //Encrypt password here
    this.password = await bcrypt.hash(this.password, 10);
    next();

}) 

userSchema.methods.matchPassword = async function(password,userPassword ) {
    return await bcrypt.compare(password,userPassword);  
}

userSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
    if(this.passwordChangedAt){
        const changedpasswordTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedpasswordTimestamp, JWTTimestamp)

        return JWTTimestamp < changedpasswordTimestamp;
    }
    return false;

}


userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    //encrypt
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExp = Date.now() + 10 * 60 * 1000;

    return resetToken;
}


userSchema.pre(/^find/, function(next){
    this.find({active: {$ne: false}});
    next();
})

module.exports = mongoose.model ('User', userSchema)