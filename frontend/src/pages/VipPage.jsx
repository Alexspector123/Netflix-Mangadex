import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';

const VipPage = () => {
  const navigate = useNavigate(); // Khai báo useNavigate trong component

  const handleVipPurchase = async () => {
    try {
      const response = await axios.post('/api/users/update-vip', {
        userId: user._id,
      });
  
      // ✅ Backend trả về response.data.msg => dùng cái này
      toast.success('Đăng ký VIP thành công!');
      navigate('/');
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
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
            onClick={() => handleVipPurchase('basic')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Gói VIP Basic
          </button>
          <button
            onClick={() => handleVipPurchase('premium')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Gói VIP Premium
          </button>
          <button
            onClick={() => handleVipPurchase('exclusive')}
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
