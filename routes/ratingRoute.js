const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const protectRoute = require("../middleware/protectRoute")


router.route('/addRating').post(protectRoute.verifyJWT, ratingController.addRating);
router.route('/checkRating').get(protectRoute.verifyJWT, ratingController.checkRating);


module.exports = router;    