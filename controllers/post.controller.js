const User = require("../models/user.model");
const Post = require("../models/post.model");
const { NotFound } = require("../utils/errors");

const postTweet = async (req, res, next) => {
	const { userId, post } = req.body;
	try {
		const foundUser = await User.findById(userId);
		const foundPost = await Post.findOne({ userId });

		if (foundPost) {
			foundPost.posts = foundPost.posts.concat({ post });
			const updatedPosts = await foundPost.save();
			return res.status(201).json({ message: "Added a new post!", item: updatedPosts });
		}
		const newPost = new Post({ userId, posts: [{ post }] });
		foundUser.posts = newPost;
		await foundUser.save();
		const updatedPosts = await newPost.save();
		return res.status(201).json({ message: "Added a new post!", item: updatedPosts });
	} catch (error) {
		next(error);
	}
};

const likeTweet = async (req, res, next) => {
	const { userId, postId } = req.body;
	try {
		const foundPost = await Post.findOne({ userId });

		if (!foundPost) {
			throw new NotFound("Post Not found!");
		}

		foundPost.posts.map((el) =>
			String(el._id) === String(postId) ? el.likes.push(userId) : el
		);

		const likedPost = await foundPost.save();
		return res.status(200).json({ message: "Liked a post", item: likedPost });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const disLikeTweet = async (req, res, next) => {
	const { userId, postId } = req.body;
	try {
		const foundPost = await Post.findOne({ userId });
		const postToBeDisliked =
			foundPost && foundPost.posts.find((el) => String(el._id) === String(postId));

		if (!foundPost) {
			throw new NotFound("Post Not found!");
		}

		postToBeDisliked.likes = postToBeDisliked.likes.filter(
			(el) => String(el) !== String(userId)
		);

		foundPost.posts.map((el) =>
			String(el._id) === String(postId) ? postToBeDisliked.likes : el
		);

		const likedPost = await foundPost.save();
		return res.status(200).json({ message: "Disliked a post", item: likedPost });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const postComment = async (req, res, next) => {
	const { userId, postId, comment } = req.body;
	try {
		const foundPost = await Post.findOne({ userId });

		if (!foundPost) {
			throw new NotFound("Post Not found!");
		}

		foundPost.posts.map((el) =>
			String(el._id) === String(postId) ? el.comments.push({ users: userId, comment }) : el
		);

		const commentedPost = await foundPost.save();
		return res.status(200).json({ message: "Comment updated", item: commentedPost });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const likeComment = async (req, res, next) => {
	const { userId, postId, commentId } = req.body;
	try {
		const foundPost = await Post.findOne({ userId });
		const postToBeLiked =
			foundPost && foundPost.posts.find((el) => String(el._id) === String(postId));

		const foundComment = postToBeLiked.comments.find(
			(el) => String(el._id) === String(commentId)
		);

		if (!foundPost) {
			throw new NotFound("Post Not found!");
		}

		foundComment.likes.push(userId);

		postToBeLiked.comments = postToBeLiked.comments.map((el) =>
			String(el) === String(commentId) ? foundComment : el
		);

		foundPost.posts.map((el) =>
			String(el._id) === String(postId) ? postToBeLiked.comments : el
		);

		const commentedPost = await foundPost.save();
		return res.status(200).json({ message: "Comment liked", item: commentedPost });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

module.exports = { postTweet, likeTweet, disLikeTweet, postComment, likeComment };
