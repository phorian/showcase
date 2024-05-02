const Cart = require('../models/cart');


exports.addProductToCart = async (req, res) =>{
    const userId = req.user.id;
    const {productId, totalPrice, quantity} = req.body;

    let count;

    try {
        const existingProduct = await Cart.findOne({userId, productId});
        count = await Cart.countDocuments({userId: userId});

        if(existingProduct){
            existingProduct.totalPrice += totalPrice * quantity;
            existingProduct.quantity += quantity; 

            await existingProduct.save();

            return res.status(200).json({
                status: true,
                count: count
            });
        } else {
            const newCartItem = new Cart({
                userId: userId,
                productId: productId, 
                totalPrice: totalPrice, 
                quantity: quantity
            })

            await newCartItem.save();
            count = await Cart.countDocuments({userId: userId});

            return res.status(201).json({
                status: true,
                count: count
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}

exports.removeCartItem = async (req, res) => {
    const cartItemId = req.params.id
    const userId = req.user.id

    try {
        await Cart.findByIdAndDelete({_id: cartItemId});

        const count = await Cart.countDocuments({userId});

        return res.status(200).json({
            status: true,
            count: count
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}

exports.getCart = async(req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.find({userId: userId})
        .populate({
            path: 'productId',
            select: 'imageUrl title store rating ratingcount',
            populate: {
                path: 'store',
                select: 'time, city'
            }
        })

        return res.status(200).json({
            status: true,
            data: {
                cart
            }
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}


exports.getCartCount = async(req, res) => {
    const userId = req.user.id;

    try {
        const count = await Cart.countDocuments({userId: userId});

        return res.status(200).json({
            status: true,
            count: count
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}

exports.decrementProductQty = async(req, res) => {
    const userId = req.user.id;
    const pId = req.params.id;

    try {
        const cartItem = await Cart.findById(pId);

        if(cartItem){
            const productPrice = cartItem.totalPrice/cartItem.quantity

            if(cartItem.quantity > 1){
                cartItem.quantity -= 1;
                cartItem.totalPrice -= productPrice;
                await cartItem.save();

                res.status(200).json({
                    status: true,
                });
            } else {
                await Cart.findOneAndDelete({_id: pId});

                res.status(200).json({
                    status: true,
                });
            }
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'No cart found'
                });
            }
        }
     catch (err) {
           res.status(500).json({
                status: false,
                message: err.message
            });
        }
        
     }