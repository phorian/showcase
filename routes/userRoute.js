const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const protectRoute = require("../middleware/protectRoute")


router.route('/updatePassword').patch(protectRoute.verifyJWT, userController.updatePassword);
router.route('/updateUser').patch(protectRoute.verifyJWT, userController.updateUser);
router.route('/deleteUser').delete(protectRoute.verifyJWT, userController.deleteUser);



module.exports = router;    