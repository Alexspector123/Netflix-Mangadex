import mysql from "mysql2/promise";
import { ENV_VARS } from "./envVars.js";

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
        const [result] = await db.query(`
            SELECT COUNT(*) AS count 
            FROM information_schema.tables 
            WHERE table_schema = ? AND table_name = ?
        `, [ENV_VARS.MYSQL_DB, "Users"]);

        if (result[0].count === 0) {
            await db.query(`
                CREATE TABLE Users (
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
            `);
            console.log("Users table created.");
        } else {
            console.log("Users table already exists.");
        }
    } catch (error) {
        console.error("Error checking/creating Users table:", error.message);
        process.exit(1);
    }
};