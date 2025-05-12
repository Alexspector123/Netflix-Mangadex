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