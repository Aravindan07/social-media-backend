const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { ValidationError, BadRequest } = require("../utils/errors");
const { default: validator } = require("validator");

const registerUser = async (req, res, next) => {
	const { email, fullName, userName, password } = req.body;
	const userPresent = await User.findOne({ email });
	const getUserName = await User.findOne({ userName });
	try {
		if (!email || !fullName || !userName || !password) {
			throw new BadRequest("Missing required fields");
		}
		if (!validator.isEmail(email)) {
			throw new BadRequest("Please enter a valid email");
		}
		if (userPresent) {
			throw new ValidationError("This user already exists");
		}
		if (getUserName) {
			throw new ValidationError("This username was already taken");
		}
		const newUser = new User({ email, fullName, userName, password });

		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				throw new Error(err);
			}
			bcrypt.hash(newUser.password, salt, async (err, hash) => {
				if (err) {
					throw new Error(err);
				}
				newUser.password = hash;
				const savedUser = await newUser.save();
				jwt.sign(
					{ id: savedUser._id },
					process.env.JWTSECRET,
					{ expiresIn: "24h" },
					(err, token) => {
						if (err) {
							throw new Error(err);
						}
						savedUser.__v = undefined;
						savedUser.createdAt = undefined;
						savedUser.updatedAt = undefined;
						savedUser.password = undefined;
						res.status(201).json({
							message: "User created Successfully",
							token,
							user: savedUser,
						});
					}
				);
			});
		});
	} catch (error) {
		next(error);
	}
};

const loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			throw new BadRequest("Please Enter all fields!");
		}
		if (!validator.isEmail(email)) {
			throw new BadRequest("Please enter a valid email");
		}
		const user = await User.findOne({ email }).select("-__v -createdAt -updatedAt");
		if (!user) {
			return res.status(404).json({ message: "User does not exist" });
		}

		const checkPassword = await bcrypt.compare(password, user.password);
		if (!checkPassword) {
			throw new BadRequest("Invalid Credentials!");
		}
		const JwtSecretKey = process.env.JWTSECRET;
		jwt.sign({ id: user._id }, JwtSecretKey, { expiresIn: "24h" }, (err, token) => {
			if (err) {
				throw new Error(err);
			}
			user.password = undefined;
			res.status(200).json({ message: "You are logged in", token, user });
		});
	} catch (error) {
		next(error);
	}
};

const loadUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id).select(
			"-password -createdAt -updatedAt -__v"
		);
		return res.status(200).json({
			user,
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { registerUser, loginUser, loadUser };
