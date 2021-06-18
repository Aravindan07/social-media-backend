const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const Notification = require("../models/notification.model");
const { NotFound } = require("../utils/errors");

router.get("/:userId/get-notifications", checkAuth, async (req, res, next) => {
	const { userId } = req.params;
	try {
		const foundNotification = await Notification.findOne({ userId }).select(
			"-__v -createdAt -updatedAt"
		);
		if (!foundNotification) {
			throw new NotFound("No Notifications");
		}
		return res.status(200).json({ notifications: foundNotification });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
