const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        default: []
    },
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
    code: { //Might change to city or state --> When changed, remember to update in store controller :)
        type: String,
        required: true
    },
    logoUrl: {
        type: String,
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
})

module.exports = mongoose.model( 'Store', storeSchema);