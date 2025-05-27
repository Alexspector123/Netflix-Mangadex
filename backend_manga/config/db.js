import mysql from "mysql2/promise";
import { ENV_VARS } from "../../backend_movie/config/envVars.js";

export const db = mysql.createPool({
    host: ENV_VARS.MYSQL_HOST,
    user: ENV_VARS.MYSQL_USER,
    password: ENV_VARS.MYSQL_PASSWORD,
    database: ENV_VARS.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectDB = async () => {
    try {
        const connection = await db.getConnection();
        console.log("MySQL connected successfully.");
        connection.release();
    } catch (error) {
        console.error("Unable to connect to MySQL:", error.message);
        process.exit(1);
    }
};

export const initializeTables = async () => {
    try {
        // Create manga-specific tables only
        await db.query(`
            CREATE TABLE IF NOT EXISTS Manga (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                author VARCHAR(255),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS Chapters (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mangaId INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (mangaId) REFERENCES Manga(id) ON DELETE CASCADE
            );
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS MangaFavorites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                mangaId INT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
                FOREIGN KEY (mangaId) REFERENCES Manga(id) ON DELETE CASCADE
            );
        `);
        console.log("Manga tables ensured in db.");
    } catch (error) {
        console.error("Error creating manga tables:", error.message);
        process.exit(1);
    }
};