import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

export const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    searchHistory: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    favourites: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    isVip: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});