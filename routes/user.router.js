const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	loadUser,
	fetchAllUsers,
} = require("../controllers/users.controller");
const checkAuth = require("../middlewares/checkAuth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").all(checkAuth).get(loadUser);
router.route("/retrieve-all").all(checkAuth).get(fetchAllUsers);

module.exports = router;
