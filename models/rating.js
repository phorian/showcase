const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    ratingType: {
        type: String,
        required: true,
        enum: ['Store', 'Product']
    },
    productId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
})

module.exports = mongoose.model( 'Rating', ratingSchema);