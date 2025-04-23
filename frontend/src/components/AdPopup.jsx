// src/components/AdPopup.js
import React from 'react';

const AdPopup = ({ onClose, onSignUp }) => (
  <div className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-[9999]">
    <div className="bg-[#141414] text-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md text-center relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
      >
        ×
      </button>
      <h3 className="text-2xl font-bold mb-4">Upgrade to VIP!</h3>
      <p className="mb-6">Watch ad-free & unlock premium features 💥</p>
      <button
        onClick={onSignUp}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
      >
        Đăng ký VIP
      </button>
    </div>
  </div>
);

export default AdPopup;
