const Order = require('../models/order');


exports.placeOrder = async (req, res) => {

    const newOrder = new Order({
        ...req.body,
        userId: req.user.id
    })
    
    try {
        await newOrder.save();


        const orderId = newOrder._id;
        res.status(200).json({
            status: true,
            message: 'Order placed successfully',
            orderId: orderId
        });
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}


exports.getOrder = async (req, res) => {
    const userId = req.user.id;

    const {paymentStatus, orderStatus} = req.query;

    let query = {userId};

    if(paymentStatus){
        query.paymentStatus = paymentStatus;
    }

    if(orderStatus === orderStatus){
        query.orderStatus = orderStatus;
    
    }
    try {
        const orders = await Order.find(query)
        .populate({
            path: 'orderiItems.productId',
            select: "imageUrl title rating time"
    })

    res.status(200).json({
        status: true,
        date: {
            orders
        }
    })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }

}