const Follower = require("../models/follower.model");
const User = require("../models/user.model");
const Following = require("../models/following.model");

const addToFollowersList = async (req, res, next) => {
	const { userId, followerId } = req.body;
	try {
		const foundFollower = await Follower.findOne({ userId }).select(
			"-__v -createdAt -updatedAt"
		);
		const foundFollowing = await Following.findOne({ userId }).select(
			"-__v -createdAt -updatedAt"
		);
		const foundUser = await User.findById(userId);
		console.log("foundUser", foundUser);

		if (foundFollower && !foundFollowing) {
			foundFollower.followers.push(followerId);
			const newFollowingList = new Following({ userId, following: [followerId] });
			const newFollowing = await newFollowingList.save();
			const newList = await foundFollower.save();
			return res.status(200).json({
				message: "Added to followers",
				following: newFollowing,
				followers: newList,
			});
		}

		if (foundFollowing && !foundFollower) {
			foundFollowing.following.push(followerId);
			const newFollowing = await foundFollowing.save();
			const newList = await foundFollower.save();
			return res.status(200).json({
				message: "Added to followers",
				following: newFollowing,
				followers: newList,
			});
		}

		const newFollower = new Follower({ userId, followers: [followerId] });

		foundUser.followers = newFollower;
		await foundUser.save();
		const newList = await newFollower.save();
		return res.status(201).json({ message: "Added to followers", item: newList });
	} catch (error) {
		console.error(error);
		next(error);
	}
};

const removeFromFollowersList = async (req, res, next) => {
	const { userId, followerId } = req.body;
	try {
		const foundFollower = await Follower.findOne({ userId });
		foundFollower.followers = foundFollower.followers.filter(
			(follower) => String(follower) !== String(followerId)
		);
		const newList = await foundFollower.save();
		return res.status(200).json({ message: "Added to followers", item: newList });
	} catch (error) {
		next(error);
	}
};

module.exports = { addToFollowersList, removeFromFollowersList };
