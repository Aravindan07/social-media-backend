const express = require("express");
const router = express.Router();
const {
	getAllPostsFromFollowing,
	postTweet,
	likeTweet,
	disLikeTweet,
	postComment,
	likeComment,
	getIndividualPost,
	getAllPosts,
} = require("../controllers/post.controller");
const checkAuth = require("../middlewares/checkAuth");

router.route("/:userId/get-posts").all(checkAuth).get(getAllPosts);
router.route("/:userId/get-posts-from-following").all(checkAuth).get(getAllPostsFromFollowing);
router.route("/:userId/:postId/get-post").all(checkAuth).get(getIndividualPost);
router.route("/:userId/add-post").all(checkAuth).post(postTweet);
router.route("/:userId/:postId/like-post").all(checkAuth).post(likeTweet);
router.route("/:userId/:postId/dislike-post").all(checkAuth).put(disLikeTweet);
router.route("/:userId/:postId/add-comment").all(checkAuth).post(postComment);
router.route("/:userId/:postId/:commentId/like-comment").all(checkAuth).post(likeComment);

module.exports = router;
