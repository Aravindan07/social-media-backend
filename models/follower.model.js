const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followersSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Follower", followersSchema);
