import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import peopleRoutes from "./routes/people.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import notificationRoutes from "./routes/notification.route.js";
import userRoutes from "./routes/user.route.js"; // 👉 Import thêm route mới

import { ENV_VARS } from "./config/envVars.js";
import { connectDB, db } from "./config/db.js"; // Adjusted import to include db
import { protectRoute } from "./middleware/protectRoute.js";
import cors from "cors";

const app = express();

const PORT = ENV_VARS.MOVIE_PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:5173",
	credentials: true, 
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/people", protectRoute, peopleRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);
app.use("/api/v1/notifications", protectRoute, notificationRoutes);

app.use("/api/v1/users",protectRoute, userRoutes);

const startServer = async () => {
    try {
        await connectDB();

        const createUsersTableQuery = `
            CREATE TABLE IF NOT EXISTS Users (
                userId INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                image VARCHAR(255) DEFAULT '',
                searchHistory JSON,
                favourites JSON,
                isVip BOOLEAN DEFAULT FALSE,
                isAdmin BOOLEAN DEFAULT FALSE
            );
        `;
        await db.query(createUsersTableQuery);

        console.log("Database is ready.");

        app.listen(PORT, () => console.log("Server started at http://localhost:" + PORT));
    } catch (error) {
        console.error("Error starting server:", error.message);
    }
};

startServer();