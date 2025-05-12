import { db } from "../config/db.js";

export const User = {
  async findByPk(userId, attributes = []) {
    const columns = attributes.length > 0 ? attributes.join(", ") : "*";
    const query = `SELECT ${columns} FROM Users WHERE userId = ?;`;
    const [rows] = await db.query(query, [userId]);
    return rows.length > 0 ? rows[0] : null;
  },
  async findOne(whereClause) {
    const conditions = Object.keys(whereClause)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const values = Object.values(whereClause);
    const query = `SELECT * FROM Users WHERE ${conditions} LIMIT 1;`;
    const [rows] = await db.query(query, values);
    return rows.length > 0 ? rows[0] : null;
  },

  async create(userData) {
    const columns = Object.keys(userData).join(", ");
    const placeholders = Object.keys(userData).map(() => "?").join(", ");
    const values = Object.values(userData);
    const query = `INSERT INTO Users (${columns}) VALUES (${placeholders});`;
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...userData };
  },
};