const Rating = require('../models/rating');
const Store = require('../models/store');
const Product = require('../models/product');


exports.addRating = async (req,res) => {

    const newRating = new Rating({
        userId: req.user.id,
        ratingType: req.body.ratingType,
        product: req.body.product,
        rating: req.body.rating
    });

    try {
        await newRating.save();

        if(req.body.ratingType === "Store"){
            const store = await Rating.aggregate([
                {$match: {ratingType: req.body.ratingType, product: req.body.product}},
                {$group: {_id: '$product'}, averageRating: {$avg: '$rating'}}
            ]);

            if(store.length > 0) {
                const averageRating = store[0].averageRating;
                await Store.findByIdAndUpdate(req.body.product, {rating: averageRating}, {new: true})
            }
        }else if(req.body.ratingType === "Product"){
            const productRating = await Rating.aggregate([
                {$match: {ratingType: req.body.ratingType, product: req.body.product}},
                {$group: {_id: '$product'}, averageRating: {$avg: '$rating'}}
            ]);

            if(productRating.length > 0) {
                const averageRating = productRating[0].averageRating;
                await Product.findByIdAndUpdate(req.body.product, {rating: averageRating}, {new: true})
            }
        }
        
        res.status(201).json({
            status: true,
            message: 'Rating updated'
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
    
}

exports.checkRating = async (req,res) => {
    const ratingType =req.query.ratingType;
    const product = req.query.product;


    try {
        const existingRating = await Rating.findOne({
            userId: req.user.id,
            product: product,
            ratingType: ratingType
        });

        if(existingRating){
            res.status(200).json({
            status: true,
            message: 'You have already submitted a rating.'
        })
        }else {
            res.status(500).json({
                message: 'You have not rated this restaurant.'
        })
        }
        
    } catch (err) {
        res.status(500).json({
            message: err.message
    });
}
}