import { Sequelize } from "sequelize";
import { ENV_VARS } from "./envVars.js";

export const sequelize = new Sequelize(ENV_VARS.MYSQL_DB, ENV_VARS.MYSQL_USER, ENV_VARS.MYSQL_PASSWORD, {
    host: ENV_VARS.MYSQL_HOST,
    dialect: "mysql",
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL connected successfully.");
    } catch (error) {
        console.error("Unable to connect to MySQL:", error.message);
        process.exit(1);
    }
};