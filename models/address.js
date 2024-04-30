const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    default: {
        type: Boolean,
        default: false
    },
    deliveryInstructions: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model( 'Address', addressSchema);