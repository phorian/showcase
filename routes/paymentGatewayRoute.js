const express = require('express');
const router = express.Router();
const paymentGateway = require('../controllers/paymentGateway');
const protectRoute = require("../middleware/protectRoute");
const verifyRole = require("../middleware/verifyRole");


router.route('/createWallet').post(paymentGateway.createWallet);
router.route('/payMerchant').post(paymentGateway.payMerchant);
router.route('/withdraw').post(paymentGateway.withdrawBalance);



module.exports = router;