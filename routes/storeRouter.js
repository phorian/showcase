const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const protectRoute = require("../middleware/protectRoute");
const verifyRole = require("../middleware/verifyRole");

router.route('/store/create').post(protectRoute.verifyJWT,protectRoute.verifyRole(['Brand', 'Vendor']),storeController.createStore);
router.route('/store/search/:id').get(storeController.getStore);
router.route('/store/nearby/:code').get(storeController.getNearbyStore);
router.route('/store/random').get(storeController.getRandomStore);
router.route('/store/brand').get(storeController.getStoresByBrand);
router.route('/store/vendor').get(storeController.getStoresByVendor);


module.exports = router;