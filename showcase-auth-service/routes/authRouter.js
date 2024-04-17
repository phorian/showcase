const express = require("express")
const router = express.Router()
const registerController = require("../controllers/registerController")
const loginController = require("../controllers/loginController")
const resetPasswordController = require("../controllers/resetPasswordController")


/*router.post('/user', async (req, res) => {
    await registerController.createNewUser(req.body, "user", res)
}); */

router.route('/register').post(registerController.createNewUser);
router.route('/login').post(loginController.userLogin);
router.route('/forgotPassword').post(resetPasswordController.forgotPassword);
router.route('/resetPassword').post(resetPasswordController.resetPassword);



module.exports = router;