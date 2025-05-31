import jwt from 'jsonwebtoken';
import { db } from "../config/db.js";
import { ENV_VARS } from '../config/envVars.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-netflix"];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
    }

    const query = `SELECT * FROM Users WHERE userId = ?;`;
    const [rows] = await db.query(query, [decoded.userId]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
