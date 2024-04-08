const express = require("express")
const router = express.Router()
const registerController = require("../controllers/registerController")


/*router.post('/user', async (req, res) => {
    await registerController.createNewUser(req.body, "user", res)
}); */

router.post('/', registerController.createNewUser);


module.exports = router;