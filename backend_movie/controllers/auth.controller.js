import { db } from "../config/db.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { email, password, username } = req.body;

    // Check input parameters
    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    // Check password length
    if (password.length < 5) {
      return res.status(400).json({ success: false, message: "Password must be at least 5 characters" });
    }

    // Check existing account with username and email
    const emailQuery = `SELECT * FROM Users WHERE email = ?;`;
    const [existingUserByEmail] = await db.query(emailQuery, [email]);
    if (existingUserByEmail.length > 0) {
      return res.status(400).json({ success: false, message: "Already exist account with this email" });
    }

    const usernameQuery = `SELECT * FROM Users WHERE username = ?;`;
    const [existingUserByUsername] = await db.query(usernameQuery, [username]);
    if (existingUserByUsername.length > 0) {
      return res.status(400).json({ success: false, message: "Already exist account with this username" });
    }

    // Hash password before saving
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    // Create new user
    const createUserQuery = `
      INSERT INTO Users (email, password, username, image, role)
      VALUES (?, ?, ?, ?, 'user');
    `;
    const [result] = await db.query(createUserQuery, [email, hashedPassword, username, image]);

    console.log("[signup] New user created with ID:", result.insertId);

    // Generate token & set cookie
    generateTokenAndSetCookie(result.insertId, res);

    // Return user info and showVipAd if not VIP
    const showVipAd = true; // Default role is 'user', not 'vip'
    res.status(201).json({
      success: true,
      showVipAd: showVipAd,
      user: {
        id: result.insertId,
        email,
        username,
        image,
        role: 'user',
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Check input parameters
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check valid email and password
    const userQuery = `SELECT * FROM Users WHERE email = ?;`;
    const [users] = await db.query(userQuery, [email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Invalid credentials" });
    }

    const user = users[0];
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate token & set cookie
    generateTokenAndSetCookie(user.userId, res);

    // Return user info and showVipAd if not VIP
    const showVipAd = user.role !== 'vip';
    res.status(200).json({
      success: true,
      showVipAd: showVipAd,
      user: {
        ...user,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt-netflix");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function authCheck(req, res) {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log("Error in authCheck controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}