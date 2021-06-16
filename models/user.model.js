const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const userSchema = new Schema(
	{
		email: {
			type: String,
			trim: true,
			lowercase: true,
			validate: { validator: validator.isEmail, message: "Invalid Email", isAsync: false },
			required: true,
			unique: [true, "This email already exists"],
		},
		fullName: { type: String, required: true },
		userName: {
			type: String,
			required: true,
			unique: [true, "This username is already taken"],
		},
		password: {
			type: String,
			minLength: [6, "password should be 6 characters or more"],
			trim: true,
			required: true,
		},
		bio: String,
		location: String,
		website: String,
		posts: { type: Schema.Types.ObjectId, ref: "Post" },
		followers: { type: Number, default: 0 },
		following: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
