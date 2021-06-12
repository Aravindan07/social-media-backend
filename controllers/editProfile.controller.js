const User = require("../models/user.model");
const { NotFound } = require("../utils/errors");

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

module.exports = { editProfile };
