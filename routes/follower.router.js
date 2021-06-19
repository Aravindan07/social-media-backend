const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const {
	addToFollowersList,
	removeFromFollowersList,
} = require("../controllers/follower.controller");

router.route("/:userId/add-to-followers").all(checkAuth).post(addToFollowersList);
router.route("/:userId/remove-from-followers").all(checkAuth).put(removeFromFollowersList);

module.exports = router;
