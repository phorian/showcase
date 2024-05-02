const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const protectRoute = require("../middleware/protectRoute");
const verifyRole = require("../middleware/verifyRole");

router.route('/addAddress').post(addressController.addAddress);
router.route('/deleteAddress/:id').delete(addressController.deleteAddress);
router.route('/address/setdefault/:id').patch(addressController.setDefaultAddress);
router.route('/address/default').get(addressController.getDefaultAddress);
router.route('/address/all').get(addressController.getAddresses);


module.exports = router;