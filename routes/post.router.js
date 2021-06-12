const express = require("express");
const router = express.Router();
const {
	postTweet,
	likeTweet,
	disLikeTweet,
	postComment,
	likeComment,
} = require("../controllers/post.controller");
const checkAuth = require("../middlewares/checkAuth");

router.route("/:userId/add-post").all(checkAuth).post(postTweet);
router.route("/:userId/:postId/like-post").all(checkAuth).post(likeTweet);
router.route("/:userId/:postId/dislike-post").all(checkAuth).post(disLikeTweet);
router.route("/:userId/:postId/add-comment").all(checkAuth).post(postComment);
router.route("/:userId/:postId/:commentId/like-comment").all(checkAuth).post(likeComment);

module.exports = router;
