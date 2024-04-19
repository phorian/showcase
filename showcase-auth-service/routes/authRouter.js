const express = require("express")
const router = express.Router()
const registerController = require("../controllers/registerController")
const loginController = require("../controllers/loginController")
const resetPasswordController = require("../controllers/resetPasswordController")
const protectRoute = require("../middleware/protectRoute")


/*router.post('/user', async (req, res) => {
    await registerController.createNewUser(req.body, "user", res)
}); */

router.route('/register').post(registerController.createNewUser);
router.route('/login').post(loginController.userLogin);
router.route('/forgotPassword').post(resetPasswordController.forgotPassword);
router.route('/resetPassword/:token').patch(resetPasswordController.resetPassword);
router.route('/updatePassword').patch(protectRoute.verifyJWT, resetPasswordController.updatePassword);



module.exports = router;