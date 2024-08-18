const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    busnessEmail: {
        type: String,
        unique: true,
        required: [true, 'Please enter email.'],
        unique: true,
        lowercase: true,
        validate: [ validator.isEmail, 'Please enter a valid email.']
    },
    time: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    delivery: {
        type: Boolean,
        default: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    city: { //Might change to city or state --> When changed, remember to update in store controller :)
        type: String,
        required: true
    },
    logoUrl: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
    },
    bankCode:{
        type: String,
    },
    walletId: {
        type: String,
    },
    walletBalance: {
        type: Number,
        default: 0
    },
    walletType: {
        type: String,
        default: 'store',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    ratingCount: {
        type: String,
        default: 0
    },
    verification: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Verified", "Rejected"]
    },
    verificationMessage: {
        type: String,
        default: "Your store is under review. We wil notify you once it is verified."
    },
    deactivationDate: {
        type: Date
    }
}, 
    {timestamps: true},
)

module.exports = mongoose.model( 'Store', storeSchema);