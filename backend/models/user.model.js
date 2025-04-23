import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    searchHistory: {
        type: Array,
        default: [],
    },
    favourites: {
        type: Array,
        default: [],
    },
    role: {
        type: String,
        enum: ['user', 'vip'],
        default: 'user',
    },
    vipPackage: {
        type: String,
        enum: ['basic', 'premium', 'exclusive'],
        default: null, // Giới thiệu trường này để lưu thông tin về gói VIP mà người dùng đã đăng ký
    },
    vipExpiryDate: {
        type: Date,
        default: null, // Thêm ngày hết hạn gói VIP nếu cần
    }
});

export const User = mongoose.model('User', userSchema);
