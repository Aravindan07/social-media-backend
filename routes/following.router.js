const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const {
	addToFollowingList,
	removeFromFollowingList,
	getFollowingAndFollowers,
} = require("../controllers/following.controller");

router.route("/:userId/fetch-followers-and-following").all(checkAuth).get(getFollowingAndFollowers);
router.route("/:userId/add-to-following").all(checkAuth).post(addToFollowingList);
router.route("/:userId/remove-from-following").all(checkAuth).put(removeFromFollowingList);

module.exports = router;
