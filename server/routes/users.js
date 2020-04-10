const router = require("express").Router();
const userController = require("../controllers/users");

//Register Handle
router.post("/register", userController.postRegister);

//Login
router.post("/login", userController.login);

//Logout
router.get("/logout", userController.logout);

//Session handle
router.get("/", userController.session);

module.exports = router;
