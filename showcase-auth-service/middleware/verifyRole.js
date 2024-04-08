/*const verifyRole = (role) => async (req, res, next) => {
let { username } = req.body;

const user = await User.findOne({ username });
!role.includes(user.role)
? res.status(401).json("Sorry you do not have access to this route") : next();

};

module.exports = verifyRole
*/