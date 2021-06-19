const jwt = require("jsonwebtoken");

function checkAuth(req, res, next) {
	const token = req.headers.authorization?.split(" ")[1] || null;

	//Check for token
	if (token === null) {
		return res.status(401).json({ message: "SignIn/Register for a better experience" });
	}

	try {
		//Verify token
		const jwtSecretKey = process.env.JWTSECRET;
		const decoded = jwt.verify(token, jwtSecretKey);
		// Add user from payload
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Your session expired! Please sign in again" });
	}
}

module.exports = checkAuth;
