const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/db.connection");
const userRoutes = require("./routes/user.router");
const editProfileRoutes = require("./routes/editProfile.router");
const postRoutes = require("./routes/post.router");
const followerRoutes = require("./routes/follower.router");
const followingRoutes = require("./routes/following.router");
const notificationRoutes = require("./routes/notification.router");
const handleErrors = require("./middlewares/handleErrors");
dotenv.config();

app.use(cors());

app.use(express.json());

connectDB();

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", editProfileRoutes);
app.use("/api/v1/users", postRoutes);
app.use("/api/v1/users", followerRoutes);
app.use("/api/v1/users", followingRoutes);
app.use("/api/v1/users", notificationRoutes);

app.use(handleErrors);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
	console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode!`)
);
