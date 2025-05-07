import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
    try {
        const {email, password, username} = req.body;
        // Check input parameters
        if(!email || !password || !username) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        // Check valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({success: false, message: "Invalid email"});
        }

        // Check password length
        if(password.length < 5) {
            return res.status(400).json({success: false, message: "Password must be at least 5 characters"});
        }

        // Check existing account with username and email
        const existingUserByEmail = await User.findOne({email: email});
        if(existingUserByEmail) {
            return res.status(400).json({success: false, message: "Already exist account with this email"});
        }
        const existingUserByUsername = await User.findOne({username: username});
        if(existingUserByUsername) {
            return res.status(400).json({success: false, message: "Already exist account with this username"});
        }

        // Hash password before saving
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image,
            role: 'user',
        });

        if(newUser) {
            // Generate token & set cookie
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            // Trả về thông tin user và showVipAd nếu không phải VIP
            const showVipAd = newUser.role !== 'vip'; // Mặc định là user thường thì cần quảng cáo
            res.status(201).json({
                success: true,
                showVipAd: showVipAd, // Thêm trường này
                user: {
                    ...newUser.toJSON(),
                    password: "",
                },
            });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function login(req, res) {
    try {
        const {email, password} = req.body;

        // Check input parameters
        if(!email || !password) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        // Check valid email and password
        const user = await User.findOne({email: email});
        if(!user) {
            return res.status(404).json({success: false, message: "Invalid credentials"});
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }

        // Generate token & set cookie
        generateTokenAndSetCookie(user._id, res);

        // Trả về thông tin user và showVipAd nếu không phải VIP
        const showVipAd = user.role !== 'vip'; // Nếu không phải VIP thì hiển thị quảng cáo
        res.status(200).json({
            success: true,
            showVipAd: showVipAd, // Trả về trường này
            user: {
                ...user.toJSON(),
                password: "",
            },
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({success: true, message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function authCheck(req, res) {
    try {
        res.status(200).json({success: true, user: req.user});
    } catch (error) {
        console.log("Error in authCheck controller", error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}