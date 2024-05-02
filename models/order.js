const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    instructions: {
        type: String,
        default: ''
    }
});


const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderItems: [orderItemSchema],
    orderTotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    grandTotal: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    storeAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Completed', 'Failed']
    },
    orderStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Accepted', 'in-Transit', 'Delivered', 'Canceled']
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
},
{ timestamps: true});

module.exports = mongoose.model( 'Order', orderSchema);