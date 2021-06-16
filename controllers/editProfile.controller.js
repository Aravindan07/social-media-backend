const User = require("../models/user.model");
const { NotFound } = require("../utils/errors");

const fetchProfile = async (req, res, next) => {
	const { userName } = req.params;
	try {
		const foundUser = await User.findOne({ userName })
			.select("-__v -password -createdAt -updatedAt")
			.populate({
				path: "posts",
				model: "Post",
				populate: [
					{
						path: "userId",
						model: "User",
						select: {
							_id: 1,
							fullName: 1,
							userName: 1,
							bio: 1,
						},
					},
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
			});

		if (!foundUser) {
			throw new NotFound("User Not Found!");
		}

		return res.status(200).json({ message: "Profile fetched!", profile: foundUser });
	} catch (error) {
		next(error);
	}
};

const editProfile = async (req, res, next) => {
	const { userId, name, bio, location, website } = req.body;
	try {
		const foundUser = await User.findById(userId).select(
			"-__v -password -createdAt -updatedAt"
		);
		console.log("foundUser", foundUser);
		if (!foundUser) {
			throw new NotFound("User not found!");
		}
		foundUser.fullName = name;
		foundUser.bio = bio;
		foundUser.location = location;
		foundUser.website = website;
		const updatedUser = await foundUser.save();
		return res.status(200).json({ message: "Profile Updated!", user: updatedUser });
	} catch (error) {
		next(error);
	}
};

module.exports = { fetchProfile, editProfile };
