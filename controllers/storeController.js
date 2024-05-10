const Store = require("../models/store");
const User = require("../models/User");
const Product = require('../models/product');
const product = require("../models/product");


exports.createStore = async (req, res) => {
    const { title, time, imageUrl, owner, city, logoUrl } = req.body;

    //const user = await User.findById(userId);

    /*if(!user || (user.role !=='Brand' || user.role !== 'Vendor')){
        return res.status(401).send('Unauthorized: Only brands and Vendors can create stores.');
    }*/

    if( !title || !time || !imageUrl || !city || !logoUrl) {
        return res.status(400).json({
            status: false,
            message: 'Input all fields'});
    }
    try {

        const newStore = new Store({
            title,
            time,
            imageUrl,
            owner: req.user._id,
            city,
            logoUrl
    });
        await newStore.save();


        res.status(201).json({
            status: true,
            message: 'Store created.'
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}


exports.getStore = async (req, res) => {
    const id = req.params.id;
    try {
        const store = await Store.findById(id);
        res.status(200).json({
            status: true,
            data: {
                store
            }
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}


exports.getNearbyStore = async (req, res) => { //Homescreen with products --> Stores around you
    
    const city = req.params.city;

    try {

        let nearbyStore = [];

        if(city){
            nearbyStore = await Store.aggregate([
                {$match: {city: city, isAvailable: true}},
                {$sample: {size: 5}},
                {$project: {__v: 0}}
            ])
        }

        if(nearbyStore === 0){
            nearbyStore = await Store.aggregate([
                {$match: {isAvailable: true}},
                {$sample: {size: 5}},
                {$project: {__v: 0}}
            ])
        }

        res.status(200).json({
            status: true,
            result: nearbyStore.length,
            data: {
                nearbyStore
            },
        })


    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

exports.getRandomStore = async (req, res) => { //Homescreen with products --> You might like
    try {
        let randomStore = [];

            randomStore = await Store.aggregate([
                {$match: {isAvailable: true}},
                {$sample: {size: 5}},
                {$project: {__v: 0}}
            ])

        if(randomStore === 0){
            randomStore = await Store.aggregate([
                {$match: {isAvailable: true}},
                {$sample: {size: 5}},
                {$project: {__v: 0}}
            ])
        }

        res.status(200).json({
            status: true,
            data: {
                randomStore
            },
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

exports.getStoresByBrand = async (req, res) => {
    try {
        const brandUsers = await User.find({role: 'Brand'});
        const brandUsersIds = brandUsers.map((user) => user._id);

        const brandStores = await Store.find({owner: {$in: brandUsersIds}});
        res.status(200).json({
            status: true,
            length:brandStores.length,
            data: {
                brandStores
            }
        })
        
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
        
    }

}

exports.getStoresByVendor = async (req, res) => {
    try {
        const vendorUsers = await User.find({role: 'Vendor'});
        const vendorUsersIds = vendorUsers.map((user) => user._id);

        const vendorStores = await Store.find({owner: {$in: vendorUsersIds}});
        res.status(200).json({
            status: true,
            length:vendorStores.length,
            data: {
                vendorStores
            }
        })
        
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
        
    }

}

exports.disableStore = async (req, res) => { //Disable store and delete after 30days

    const userId = req.user._id;

    try {

        const store = await Store.findOne({owner: userId});

        if(!store){
            return  res.status(404).json({
                status: 'false',
                message: "You don't have access to this store"
            });
        }

        //Deactivate store
        store.isAvailable = false;
        store.deactivationDate = new Date();
        await store.save();

        //Deactivate all products in store
        await Product.updateMany({store: store._id}, { 
            $set: { isAvailable: false},
            $set: {deactivationDate: new Date()}
        });

        res.status(200).json({
            status: 'True',
            message: "Store and associated products disabled. Store and associated products will be permanently deleted in 30days"
        });
        
    } catch (err) {
        res.status(500).json({
            status: 'false',
            message: err.message
        });
    }
}

//Update Store