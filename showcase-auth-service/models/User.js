const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    password: {
        type: String,
        minlength: 6,
        required: [true, 'Please enter password']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please enter email.'],
        lowercase: true,
        validate: [ validator.isEmail, 'Please enter a valid email.']
    },
    role: {
        type: String,
        enum: [ "User", "Brand", "Vendor"],
        required: true,
    },
},
    {timestamps: true}

);

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    //Encrypt password here
    this.password = await bcrypt.hash(this.password, 10);
    next();

})

module.exports = mongoose.model ('User', userSchema)