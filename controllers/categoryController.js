const Category = require('../models/category');

exports.createCategory = async (req, res) => {
    const { title, value, imageUrl} = req.body;

    //Check Input fields
    if(!title || !value || !imageUrl){
        return res.status(400).json({'message': 'Input all fields'});
    }

    //Check for existing category
    const duplicateCategory = await Category.findOne({title: title}).exec();
    if(duplicateCategory){
        return res.sendStatus(409); //conflict --> Existing Category
    }

    try {
        const newCategory = await Category.create(
            req.body,
        );

        res.status(201).json({
            status: true,
            message: 'Category created.',
            data: {
                newCategory,
            },
        });

    } catch(err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({title: {$ne: "More"}}, {__v: 0});  //Get all category except more
        res.status(200).json({
            status: true,
            result: categories.length,
            data: {
                categories
            },
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
}

//Random Categories will be displayed on Users homescreen
exports.getRandomCategories = async(req, res) => {
    try {
        let categories = await Category.aggregate([
            {$match: {value: {$ne: "More"}}},
            {$sample: {size: 5}}
        ]);

        const moreCategory = await Category.findOne({value: "More"}, {__v: 0});

        if(moreCategory){
            categories.push(moreCategory)
        }

        res.status(200).json({
            status: true,
            result: categories.length,
            data: {
                categories
            },
        })

    } catch(err){
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
} 