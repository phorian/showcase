const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const protectRoute = require("../middleware/protectRoute");
const verifyRole = require("../middleware/verifyRole");

router.route('/order/place').post(orderController.placeOrder);
router.route('/order/get').get(orderController.getOrder);



module.exports = router;