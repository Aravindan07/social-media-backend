const User = require("../models/user.model");
const Post = require("../models/post.model");
const Following = require("../models/following.model");
const Notification = require("../models/notification.model");
const { NotFound } = require("../utils/errors");

const getAllPosts = async (req, res, next) => {
	try {
		const posts = await Post.find({})
			.select("-__v -createdAt -updatedAt")
			.populate([
				{
					path: "userId",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
					},
				},
				{
					path: "posts.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.users",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
			]);
		return res.status(200).json({ posts });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const getAllPostsFromFollowing = async (req, res, next) => {
	const { userId } = req.params;
	try {
		const foundFollowing = await Following.findOne({ userId })
			.select("-__v -password -createdAt -updatedAt")
			.populate({
				path: "following",
				model: "User",
				select: { fullName: 1, userName: 1, posts: 1 },
				populate: [
					{
						path: "posts",
						populate: [
							{
								path: "posts.likes",
								model: "User",
								select: {
									_id: 1,
									fullName: 1,
									userName: 1,
									bio: 1,
								},
							},
							{
								path: "posts.comments.users",
								model: "User",
								select: {
									_id: 1,
									fullName: 1,
									userName: 1,
									bio: 1,
								},
							},
							{
								path: "posts.comments.likes",
								model: "User",
								select: {
									_id: 1,
									fullName: 1,
									userName: 1,
									bio: 1,
								},
							},
						],
					},
				],
			});
		console.log("foundFollowing", foundFollowing);

		const posts = await Post.find({})
			.select("-__v -createdAt -updatedAt")
			.populate([
				{
					path: "userId",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
					},
				},
				{
					path: "posts.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.users",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
			]);

		if (!foundFollowing || foundFollowing.following.filter((el) => el.posts).length === 0) {
			console.log("inside 1st if");
			return res.status(200).json({ posts });
		}
		console.log("Outside if");
		return res.status(200).json({ posts: foundFollowing });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const getIndividualPost = async (req, res, next) => {
	const { userId, postId } = req.params;
	console.log(userId);
	try {
		const foundUserPosts = await Post.findOne({ userId })
			.select("-__v -createdAt -updatedAt")
			.populate([
				{
					path: "posts.likes",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
						bio: 1,
					},
				},
				{
					path: "posts.comments.users",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
						bio: 1,
					},
				},
				{
					path: "posts.comments.likes",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
						bio: 1,
					},
				},
			]);
		const user = await User.findById(userId).select(
			"-__v -createdAt -updatedAt -password -email -location -website -posts -followers -following"
		);
		const requiredPost = foundUserPosts.posts.find(
			(post) => String(post._id) === String(postId)
		);
		return res.status(200).json({ post: requiredPost, user });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const postTweet = async (req, res, next) => {
	const { userId, post } = req.body;
	try {
		const foundUser = await User.findById(userId);
		const foundPost = await Post.findOne({ userId })
			.select("-__v -createdAt -updatedAt")
			.populate([
				{
					path: "userId",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
					},
				},
				{
					path: "posts.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.users",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
			]);

		if (foundPost) {
			foundPost.posts = foundPost.posts.concat({ post });
			const posts = await foundPost.save();
			return res.status(201).json({ message: "Added a new post!", posts });
		}
		const newPost = new Post({ userId, posts: [{ post }] });
		foundUser.posts = newPost;
		await foundUser.save();
		const posts = await newPost.save();
		return res.status(201).json({ message: "Added a new post!", posts });
	} catch (error) {
		next(error);
	}
};

const likeTweet = async (req, res, next) => {
	const { userPostId, likedUserId, postId } = req.body;
	try {
		const foundPost = await Post.findOne({ userId: userPostId })
			.select("-__v -createdAt -updatedAt")
			.populate([
				{
					path: "userId",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
					},
				},
				{
					path: "posts.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.users",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
			]);

		const foundNotification = await Notification.findOne({ userId: userPostId });
		const likedUser = await User.findById(likedUserId).select("fullName");

		if (!foundPost) {
			throw new NotFound("Post Not found!");
		}

		foundPost.posts.map((el) =>
			String(el._id) === String(postId) ? el.likes.push(likedUserId) : el
		);

		const posts = await foundPost.save();
		// let posts = await allPosts.save();
		if (likedUserId !== userPostId) {
			if (foundNotification) {
				foundNotification.notifications.unshift(`${likedUser.fullName} liked your post`);
				await foundNotification.save();
			}
			if (!foundNotification) {
				const newNotification = new Notification({
					userId: userPostId,
					notifications: [`${likedUser.fullName} liked your post`],
				});
				await newNotification.save();
			}
		}
		return res.status(200).json({ message: "Liked a post", posts });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const disLikeTweet = async (req, res, next) => {
	const { userPostId, likedUserId, postId } = req.body;
	try {
		const foundPost = await Post.findOne({ userId: userPostId }).select(
			"-__v -createdAt -updatedAt"
		);

		const postToBeDisliked =
			foundPost && foundPost.posts.find((el) => String(el._id) === String(postId));

		if (!foundPost) {
			throw new NotFound("Post Not found!");
		}

		postToBeDisliked.likes = postToBeDisliked.likes.filter(
			(el) => String(el) !== String(likedUserId)
		);

		foundPost.posts.map((el) =>
			String(el._id) === String(postId)
				? el.likes.filter((item) => String(item) === String(likedUserId))
				: el
		);

		let posts = await foundPost.save();
		posts = await posts
			.populate([
				{
					path: "userId",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
					},
				},
				{
					path: "posts.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.users",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
			])
			.execPopulate();
		return res.status(200).json({ message: "Disliked a post", posts });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const postComment = async (req, res, next) => {
	const { postUserId, postId, commentedUserId, comment } = req.body;
	try {
		const foundPost = await Post.findOne({ userId: postUserId }).select(
			"-__v -createdAt -updatedAt"
		);

		const foundNotification = await Notification.findOne({ userId: postUserId });

		const commentedUser = await User.findById(commentedUserId).select("fullName");

		if (!foundPost) {
			throw new NotFound("Post Not found!");
		}

		foundPost.posts.map((el) =>
			String(el._id) === String(postId)
				? el.comments.push({ users: commentedUserId, comment })
				: el
		);

		if (postUserId !== commentedUserId) {
			if (foundNotification) {
				foundNotification.notifications.unshift(
					`${commentedUser.fullName} commented on your post`
				);
				await foundNotification.save();
			}
			if (!foundNotification) {
				const newNotification = new Notification({
					userId: postUserId,
					notifications: [`${commentedUser.fullName} commented on your post`],
				});
				await newNotification.save();
			}
		}

		let posts = await foundPost.save();
		posts = await posts
			.populate([
				{
					path: "userId",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
					},
				},
				{
					path: "posts.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.users",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
			])
			.execPopulate();

		return res.status(200).json({ message: "Comment updated", posts });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const likeComment = async (req, res, next) => {
	const { userPostId, likedUserId, postId, commentId } = req.body;
	try {
		const foundPost = await Post.findOne({ userId: userPostId }).select(
			"-__v -createdAt -updatedAt"
		);

		const postToBeLiked =
			foundPost && foundPost.posts.find((el) => String(el._id) === String(postId));

		const foundComment = postToBeLiked.comments.find(
			(el) => String(el._id) === String(commentId)
		);

		if (!foundPost) {
			throw new NotFound("Post Not found!");
		}

		foundComment.likes.push(likedUserId);

		postToBeLiked.comments = postToBeLiked.comments.map((el) =>
			String(el) === String(commentId) ? foundComment : el
		);

		foundPost.posts.map((el) =>
			String(el._id) === String(postId) ? postToBeLiked.comments : el
		);

		let posts = await foundPost.save();
		posts = await posts
			.populate([
				{
					path: "userId",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
					},
				},
				{
					path: "posts.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.users",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
				{
					path: "posts.comments.likes",
					model: "User",
					select: {
						createdAt: 0,
						updatedAt: 0,
						__v: 0,
						posts: 0,
						password: 0,
						email: 0,
						followers: 0,
						following: 0,
						location: 0,
						website: 0,
					},
				},
			])
			.execPopulate();

		return res.status(200).json({ message: "Comment liked", posts });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

module.exports = {
	// getAllPostsFromFollowing,
	postTweet,
	likeTweet,
	disLikeTweet,
	postComment,
	likeComment,
	getIndividualPost,
	getAllPosts,
	getAllPostsFromFollowing,
};
