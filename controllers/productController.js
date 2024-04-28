const { query } = require('express');
const Product = require('../models/product');
const Store = require("../models/store");
const User = require("../models/User");



exports.addProduct = async (req,res) => {
const {title, description, productTags, productType, category, city, price, imageUrl} = req.body

if(!title || !description || !productTags|| !category || !productType || !city || !price || !imageUrl){
    return res.Status(400).json({
        status: false,
        message: 'Input all fields'});
}

//Find store associated with logged in user
const store = await Store.findOne({owner: req.user._id});
if(!store){
    return res.status(404).json({
        status: false,
        message: "Store not found"
    })
}

    try {

        const newProduct = new Product({
            title,
            description,
            productTags,
            productType,
            category,
            city,
            store: store._id,
            price,
            imageUrl
        });

        await newProduct.save();

        //Add product to your store
        store.products.push(newProduct._id);
        await store.save();

        res.status(201).json({
            status: true,
            message: 'Producted added to your store.'
        });
        
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}


exports.getProductById = async (req, res) => {
    const id = req.params.id;
    try {

        const product = await Product.findById(id);

        res.status(200).json({
            status: true,
            data: {
                product
            }
        })
        
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

exports.getRecommendedProducts = async (req, res) => { //Displayed on homescreen, --> In your area

    try { 

     //Get city associated with the loggedin user
     const userCity = req.user.city;
 
         const storesInCity = await Store.find({city: userCity});
 
        let randomProduct = [];

        if(storesInCity){
            randomProduct = await Product.aggregate([
                {$match: {store: {$in: storesInCity.map(store => store._id)}, isAvailable: true}},
                {$sample: {size: 5}},
                {$project: {__V:0}}
            ])
        } 

        if(randomProduct.length === 0){
            randomProduct = await Product.aggregate([
                {$match: {isAvailable: true}},
                {$sample: {size: 5}},
                {$project: {__V:0}}
            ])
        }

        res.status(200).json({
            status: true,
            data: {
                randomProduct
            },
        })
        
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

exports.getProductByStore = async(req, res) => { //Store menu
    const id = req.params.id

    try {
        const products = await Product.find({store: id});

        res.status(200).json({
            status: true,
            data: {
                products
            },
        })
        
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

exports.getProductsByCategory = async(req, res) => { //Products in specific category
    const category = req.params.category

    try {
        const products = await Product.aggregate([
            {$match: {category: category, isAvailable: true}},
            {$project: {__v:0}}
    ]);

    if(products.length === 0){
        res.status(200).json({
            status: true,
            message: "No product found"
        });
    }

    res.status(200).json({
        status: true,
        data: {
            products
        },
    })
        
    } catch (error) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

exports.searchProduct = async (req, res) => {
    const search  = req.params.search

    try {

        const result = await Product.aggregate([
            {
                $search: {
                    index: "products",
                    text: {
                        query: search,
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            }
        ])

        res.status(200).json({
            status: true,
            data: {
                result
            }
        })
        
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

exports.getRandomProductsByCategory = async (req,res) => { //Another Home screen section recommended for you --> Might not implement feature on app
    const {category, city} = req.params;

    try {
        let products;

        products = await Product.aggregate([
            {$match: {category: category, isAvailable: true}},
            {$sample: {size: 10}},
        ])
        
        if(!products || products.length === 0){
            products = await Product.aggregate([
                {$match: {city: city, isAvailable: true}},
                {$sample: {size: 10}},
            ])  
        } else if(!products || products.length === 0){
            products = await Product.aggregate([
                {$match: {city: city, isAvailable: true}},
                {$sample: {size: 10}},
            ])
        }
        res.status(200).json({
            status: true,
            data: {
                products
            }
        })
        
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

//Update Product


//Delete Product


//Add counter to product to set products that are out of stock