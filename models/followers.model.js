const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followersSchema = new Schema(
	{
		users: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Follower", followersSchema);
