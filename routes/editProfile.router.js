const express = require("express");
const router = express.Router();
const { editProfile, fetchProfile } = require("../controllers/editProfile.controller");
const checkAuth = require("../middlewares/checkAuth");

router.route("/:userName/profile").all(checkAuth).get(fetchProfile);
router.route("/:userId/edit-profile").all(checkAuth).put(editProfile);

module.exports = router;
