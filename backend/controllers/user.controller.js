
import { User } from "../models/user.model.js";
export const updateVip = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isVip: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra trả về đúng cấu trúc
    res.status(200).json({ success: true, message: "Cập nhật VIP thành công", user: updatedUser });
  } catch (error) {
    console.error("Lỗi khi cập nhật VIP:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật VIP" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId, name, email, phone, language } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId" });
    }

    // Cập nhật các trường name, email, phone, language
    const updated = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, language },
      {
        new: true,           // trả về document sau khi update
        runValidators: true, // kiểm tra schema (ví dụ: email phải đúng format)
      }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ success: true, message: "Cập nhật profile thành công", user: updated });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật profile" });
  }
};