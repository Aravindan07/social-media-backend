const Following = require("../models/following.model");
const Follower = require("../models/follower.model");
const User = require("../models/user.model");

const getFollowingAndFollowers = async (req, res, next) => {
	const { userId } = req.params;
	try {
		const foundFollowing = await Following.findOne({ userId }).populate({
			path: "following",
			model: "User",
			select: {
				_id: 1,
				fullName: 1,
				userName: 1,
				bio: 1,
			},
		});
		const foundFollower = await Follower.findOne({ userId }).populate({
			path: "followers",
			model: "User",
			select: {
				_id: 1,
				fullName: 1,
				userName: 1,
				bio: 1,
			},
		});
		return res.status(200).json({
			following: foundFollowing ? foundFollowing.following : [],
			followers: foundFollower ? foundFollower.followers : [],
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const addToFollowingList = async (req, res, next) => {
	const { userId, followingId } = req.body;
	try {
		const foundFollowing = await Following.findOne({ userId });
		const foundFollower = await Follower.findOne({ userId: followingId });
		const user = await User.findById(userId).select("-__v -password -createdAt -updatedAt");
		const followedUser = await User.findById(followingId).select(
			"-__v -password -createdAt -updatedAt"
		);

		if (foundFollowing && foundFollower) {
			console.log("Inside 1st if");
			foundFollowing.following.push(followingId);
			user.following = foundFollowing.following.length;
			foundFollower.followers.push(userId);
			followedUser.followers = foundFollower.followers.length;
			await user.save();
			await foundFollower.save();
			await followedUser.save();
			let followingList = await foundFollowing.save();
			followingList = await followingList
				.populate({
					path: "following",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
						bio: 1,
					},
				})
				.execPopulate();
			return res
				.status(200)
				.json({ message: "Added to following", following: followingList });
		}

		if (foundFollowing && !foundFollower) {
			console.log("inside 2nd if");
			foundFollowing.following.push(followingId);
			user.following = foundFollowing.following.length;
			await user.save();
			const firstFollowerForUser = new Follower({ userId: followingId, followers: [userId] });
			followedUser.followers = 1;
			await followedUser.save();
			await firstFollowerForUser.save();
			let followingList = await foundFollowing.save();
			followingList = await followingList
				.populate({
					path: "following",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
						bio: 1,
					},
				})
				.execPopulate();
			return res
				.status(200)
				.json({ message: "Added to following", following: followingList });
		}
		if (!foundFollowing && foundFollower) {
			const newFollowing = new Following({ userId, following: [followingId] });
			user.following = 1;
			await user.save();
			foundFollower.followers.push(userId);
			followedUser.followers = foundFollower.followers.length;
			await followedUser.save();
			let followingList = await foundFollowing.save();
			followingList = await followingList
				.populate({
					path: "following",
					model: "User",
					select: {
						_id: 1,
						fullName: 1,
						userName: 1,
						bio: 1,
					},
				})
				.execPopulate();
			return res
				.status(201)
				.json({ message: "Added to following", following: followingList });
		}
		const newFollowing = new Following({ userId, following: [followingId] });
		const newFollower = new Follower({ userId: followingId, followers: [userId] });
		user.following = 1;
		followedUser.followers = 1;
		await user.save();
		followedUser.save();
		await newFollower.save();
		let followingList = await foundFollowing.save();
		followingList = await followingList
			.populate({
				path: "following",
				model: "User",
				select: {
					_id: 1,
					fullName: 1,
					userName: 1,
					bio: 1,
				},
			})
			.execPopulate();
		return res.status(201).json({ message: "Added to following", following: followingList });
	} catch (error) {
		next(error);
	}
};

const removeFromFollowingList = async (req, res, next) => {
	const { userId, followingId } = req.body;
	try {
		const foundFollowing = await Following.findOne({ userId });
		const foundFollower = await Follower.findOne({ userId: followingId });
		const user = await User.findById(userId).select("-__v -password -createdAt -updatedAt");
		const followedUser = await User.findById(followingId).select(
			"-__v -password -createdAt -updatedAt"
		);
		foundFollowing.following = foundFollowing.following.filter(
			(following) => String(following) !== String(followingId)
		);
		user.following = foundFollowing.following.length;
		foundFollower.followers = foundFollower.followers.filter(
			(follower) => String(follower) !== String(userId)
		);
		followedUser.followers = foundFollower.followers.length;

		await user.save();
		await followedUser.save();
		await foundFollower.save();
		let followingList = await foundFollowing.save();
		followingList = await followingList
			.populate({
				path: "following",
				model: "User",
				select: {
					_id: 1,
					fullName: 1,
					userName: 1,
					bio: 1,
				},
			})
			.execPopulate();
		return res
			.status(200)
			.json({ message: "Removed from following", following: followingList });
	} catch (error) {
		next(error);
	}
};

module.exports = { getFollowingAndFollowers, addToFollowingList, removeFromFollowingList };
