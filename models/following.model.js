const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followingSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		following: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Following", followingSchema);
