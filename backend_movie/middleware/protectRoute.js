import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ENV_VARS } from '../config/envVars.js';

export const protectRoute = async (req, res, next) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies["jwt-netflix"];
    
    // Kiểm tra nếu không có token
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
    }

    // Xác thực và giải mã token
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

    // Kiểm tra token hợp lệ không
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
    }

    // Tìm user từ database dựa vào userId
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });

    // Kiểm tra nếu không tìm thấy user
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Gán thông tin user vào req.user để dùng trong các route tiếp theo
    req.user = user;

    // Tiếp tục với các middleware hoặc route tiếp theo
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: " + error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
