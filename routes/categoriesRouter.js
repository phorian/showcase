const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const protectRoute = require("../middleware/protectRoute");
const verifyRole = require("../middleware/verifyRole");

router.route('/createCategories').post(categoryController.createCategory);
router.route('/categories').get(categoryController.getAllCategories);
router.route('/randomcategories').get(categoryController.getRandomCategories);


module.exports = router;