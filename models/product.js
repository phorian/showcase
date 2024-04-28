const mongoose = require('mongoose');
const Schema = mongoose.Schema

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    productTags: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    productType: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    delivery: {
        type: Boolean,
        default: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
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
        default: "45"
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL"]
    },
    imageUrl: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema);