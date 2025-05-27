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
                manga_id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                cover_url VARCHAR(500),
                status ENUM('ongoing', 'completed', 'hiatus') DEFAULT 'ongoing',
                country VARCHAR(100),
                year_release VARCHAR(10),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS Chapters (
                chapter_id INT PRIMARY KEY AUTO_INCREMENT,
                manga_id INT NOT NULL,
                chapter_number VARCHAR(20),
                title VARCHAR(255),
                upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (manga_id) REFERENCES Manga(manga_id) ON DELETE CASCADE
            );
        `);
        await db.query(`
            CREATE TABLE IF NOT EXISTS Page (
                chapter_id INT NOT NULL,
                page_number INT NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                FOREIGN KEY (chapter_id) REFERENCES Chapter(chapter_id) ON DELETE CASCADE
            );
        `);
        console.log("Manga tables ensured in db.");
    } catch (error) {
        console.error("Error creating manga tables:", error.message);
        process.exit(1);
    }
};