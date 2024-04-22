const User = require("../models/User");
//const sendEmail = require('../../utils/email');
const jwt = require('jsonwebtoken');
//const crypto = require('crypto');



exports.getAllBrands = async (req, res, next) => {
    const brands = await User.find({role: 'Brand'});

    next(res.status(200).json({
        status: 'success',
        result: brands.length,
        data: {
            brands
        }
    }));
}

exports.getAllVendors = async (req, res, next) => {
    const vendors = await User.find({role: 'Vendor'});

    next(res.status(200).json({
        status: 'success',
        result: vendors.length,
        data: {
            vendors
        }
    }));
}


const filterReqObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(prop => {
        if(allowedFields.includes(prop))
        newObj[prop] = obj[prob];
    })

    return newObj;
}

exports.updatePassword = async (req, res, next) => {

    //Get current user data from DB
    const user = await User.findById(req.user._id).select('+password');


    //Confirm Data {password}
    if(!(await user.matchPassword(req.body.currentPassword, user.password))){
        return res.status(401).json('The current password is not correct');
    }
    
    //If correct, update password with new value
    user.password = req.body.password, 
    await user.save();

    //Login and sign JWT
    const token = jwt.sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        })

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
}

exports.updateUser = async (req, res, next) => {

    //Check if request contains password
    if(req.body.password) {
        return next(res.status(400).json('You cannot update your password with this endpoint'));
    }

    //Update User
    const filterObj = filterReqObj(req.body, 'username', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterObj, {runValidators: true, new: true});
    
    res.status(200).json({
        status: 'success',
        data: {
            updatedUser
        }
    });
}


exports.deleteUser = async (req, res, next) => {
   await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null
    });
}