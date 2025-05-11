import { User } from "../models/user.model.js";

export const updateVip = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId" });
    }

    const [updatedRowsCount, updatedUsers] = await User.update(
      { isVip: true },
      {
        where: { userId: userId },
        returning: true,
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    const updatedUser = updatedUsers[0];

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

    const [updatedRowsCount, updatedUsers] = await User.update(
      { name, email, phone, language },
      {
        where: { id: userId },
        returning: true,
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    const updatedUser = updatedUsers[0];

    res.status(200).json({ success: true, message: "Cập nhật profile thành công", user: updatedUser });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật profile" });
  }
};