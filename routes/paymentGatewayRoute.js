const express = require('express');
const router = express.Router();
const paymentGateway = require('../controllers/paymentGateway');
const protectRoute = require("../middleware/protectRoute");
//const verifyRole = require("../middleware/verifyRole");


router.route('/createUserWallet').post(protectRoute.verifyJWT, paymentGateway.createUserWallet);
router.route('/createStoreWallet').post(protectRoute.verifyJWT, paymentGateway.createStoreWallet);
router.route('/payMerchant').post(protectRoute.verifyJWT, paymentGateway.payMerchant);
router.route('/withdraw').post(protectRoute.verifyJWT, paymentGateway.withdrawBalance);



module.exports = router;