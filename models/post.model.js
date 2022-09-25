const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		posts: [
			{
				post: String,
				comments: [
					{
						users: { type: Schema.Types.ObjectId, ref: "User" },
						comment: "String",
						likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
					},
				],
				likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
