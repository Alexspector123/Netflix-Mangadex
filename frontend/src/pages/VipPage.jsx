import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authUser';

const VipPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleVipPurchase = async () => {
    if (!user || !user._id) {
      toast.error("Không tìm thấy thông tin người dùng!");
      return;
    }
  
    try {
      // Gọi API để cập nhật role của người dùng thành VIP
      const response = await axios.post('/api/v1/users/update-vip', {
        userId: user._id,
      }, {
        withCredentials: true // Đảm bảo token được gửi trong cookie
      });
  
      if (response.data.success) {
        toast.success('Đăng ký VIP thành công!');
        navigate('/'); // Điều hướng về trang chủ sau khi thành công
      } else {
        toast.error('Lỗi khi đăng ký VIP!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi khi kết nối với server');
    }
  };
  
  

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-4xl font-bold mb-6">Mua VIP</h1>
        <p className="text-lg mb-8">Chọn gói VIP để trải nghiệm các tính năng cao cấp!</p>

        <div className="flex gap-6">
          <button
            onClick={handleVipPurchase}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Gói VIP Basic
          </button>
          <button
            onClick={handleVipPurchase}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Gói VIP Premium
          </button>
          <button
            onClick={handleVipPurchase}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Gói VIP Exclusive
          </button>
        </div>

        <p className="mt-6 text-lg">Trở thành VIP để không quảng cáo và có nhiều quyền lợi hơn!</p>
      </div>
    </div>
  );
};

export default VipPage;
