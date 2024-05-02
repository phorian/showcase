const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const protectRoute = require("../middleware/protectRoute");
const verifyRole = require("../middleware/verifyRole");

router.route('/cart').post(cartController.addProductToCart);
router.route('/cart/decrement').get(cartController.decrementProductQty);
router.route('/cart/all').get(cartController.getCart);
router.route('/cart/count').get(cartController.getCartCount);
router.route('/cart/delete').delete(cartController.removeCartItem);


module.exports = router;