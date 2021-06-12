const express = require("express");
const router = express.Router();
const { editProfile } = require("../controllers/editProfile.controller");
const checkAuth = require("../middlewares/checkAuth");

router.route("/:userId/edit-profile").all(checkAuth).post(editProfile);

module.exports = router;
