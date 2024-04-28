const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const protectRoute = require("../middleware/protectRoute");
const verifyRole = require("../middleware/verifyRole");

router.route('/product/create').post(protectRoute.verifyJWT, productController.addProduct);
router.route('/product/:id').get(productController.getProductById);
router.route('/product/search/:search').get(productController.searchProduct);
router.route('/random').get(protectRoute.verifyJWT, productController.getRecommendedProducts);
router.route('/store/menu/:id').get(productController.getProductByStore);
router.route('/category/products/:category').get(productController.getProductsByCategory);
router.route('/product/:category/:city').get(productController.getRandomProductsByCategory);


module.exports = router;