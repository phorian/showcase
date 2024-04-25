const Store = require("../models/store");
const User = require("../models/User");


exports.createStore = async (req, res) => {
    const { title, time, imageUrl, owner, code, logoUrl } = req.body;

    //const user = await User.findById(userId);

    /*if(!user || (user.role !=='Brand' || user.role !== 'Vendor')){
        return res.status(401).send('Unauthorized: Only brands and Vendors can create stores.');
    }*/

    if( !title || !time || !imageUrl || !code || !logoUrl) {
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
            code,
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
    
    const code = req.params.code;

    try {

        let nearbyStore = [];

        if(code){
            nearbyStore = await Store.aggregate([
                {$match: {code: code, isAvailable: true}},
                {$project: {__v: 0}}
            ])
        }

        if(nearbyStore === 0){
            nearbyStore = await Store.aggregate([
                {$match: {isAvailable: true}},
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