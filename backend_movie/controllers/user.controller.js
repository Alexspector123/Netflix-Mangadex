import { db } from "../config/db.js";

export const updateVip = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId" });
    }

    const query = `
      UPDATE Users
      SET isVip = true
      WHERE userId = ?;
    `;
    const values = [userId];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ success: true, message: "Cập nhật VIP thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật VIP:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật VIP" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId, name, email, language } = req.body;  // Bỏ phone
    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId" });
    }

    const query = `
      UPDATE Users
      SET username = ?, email = ?, language = ?
      WHERE userId = ?;
    `;
    const values = [name, email, language, userId];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ success: true, message: "Cập nhật profile thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error.message);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật profile" });
  }
};
