const router = require("express").Router();
const authController = require("../controllers/auth");


router.post("/", authController.auth);
router.get("/", authController.auth);

module.exports = router;
