import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authUser";
import axios from "axios";
import {
  Edit3,
  CheckCircle,
  Camera,
  LogOut,
  Clock,
  Heart,
  User,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Star,
  Mail,
  Globe,
  Plus,
  Calendar,
  Shield,
  Download,
  X,
  Film
} from "lucide-react";

const tabs = [
  { key: "profile", label: "Thông tin", icon: <User size={18} /> },
  { key: "history", label: "Lịch sử xem", icon: <Clock size={18} /> },
  { key: "favourites", label: "Yêu thích", icon: <Heart size={18} /> },
  { key: "subscription", label: "Gói VIP", icon: <CreditCard size={18} /> },
];

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [favList, setFavList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.image);
  const fileInputRef = useRef(null);

  // ----------------------- INIT ----------------------------------
  useEffect(() => {
    setProfileData({
      name: user.username,
      email: user.email,
      phone: user.phone || "",
      language: user.language || "Tiếng Việt",
    });
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "history") {
          const res = await axios.get("/api/v1/search/history", { withCredentials: true });
          setHistoryList(res.data.content || []);
        } else if (activeTab === "favourites") {
          const res = await axios.get("/api/v1/search/favourite", { withCredentials: true });
          setFavList(res.data.content || []);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Lấy các trường từ profileData
      const { name, email, phone, language } = profileData;

      await axios.put(
        "/api/v1/user/profile",
        { userId: user._id, name, email, phone, language },
        { withCredentials: true }
      );
      setIsEditing(false);
    } catch (err) {
      console.error("Lỗi khi lưu profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    const form = new FormData();
    form.append("avatar", file);
    await axios.post("/api/v1/user/avatar", form, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  // ------------------ RENDER HELPERS -----------------------------
  const renderProfileContent = () => {
    if (!profileData) return null;
    const fields = [
      { label: "Tên người dùng", value: profileData.name, name: "name", icon: <User size={18} /> },
      { label: "Email", value: profileData.email, name: "email", icon: <Mail size={18} /> },
      { label: "Ngôn ngữ", value: profileData.language, name: "language", icon: <Globe size={18} /> },
    ];
    
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User size={24} className="text-red-500" /> 
          Thông tin cá nhân
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label} className="bg-gray-800/70 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-red-600 transition-all duration-300">
              <div className="flex items-center gap-2 mb-3 text-gray-300 text-sm font-medium">
                <span className="text-red-500">{f.icon}</span>
                {f.label}
              </div>
              
              {isEditing && f.name === "language" ? (
                <select
                  name="language"
                  value={profileData.language}
                  onChange={(e) => setProfileData((p) => ({ ...p, language: e.target.value }))}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="English">English</option>
                </select>
              ) : isEditing && f.name ? (
                <input
                  type="text"
                  name={f.name}
                  value={profileData[f.name]}
                  onChange={(e) => setProfileData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              ) : (
                <p className="text-white text-lg font-medium">{f.value || "—"}</p>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-5 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-all flex items-center gap-2"
            >
              <X size={16} /> Hủy
            </button>
            <button 
              onClick={handleSave}
              className="px-5 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
            >
              <CheckCircle size={16} /> Lưu thay đổi
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderMediaCard = (item, isFav = false) => (
    <div
      key={item.id}
      className="group relative bg-gray-800/70 rounded-xl overflow-hidden shadow-lg border border-gray-700/50 hover:border-red-600 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
      
      <img
        src={item.image ? `https://image.tmdb.org/t/p/w300${item.image}` : "/placeholder.png"}
        alt={item.title}
        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="text-white font-bold line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">{item.title}</h3>
        
        <div className="flex items-center justify-between mt-2">
          {item.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span>{item.rating}</span>
            </div>
          )}
          
          <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 p-2 rounded-full">
            <Film size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = (msg, icon) => (
    <div className="flex flex-col items-center py-16 text-center gap-6">
      <div className="bg-gray-800/80 p-8 rounded-full shadow-lg border border-gray-700">
        {icon}
      </div>
      <p className="text-gray-300 text-xl max-w-md">{msg}</p>
      <button className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg">
        Khám phá nội dung<ArrowRight size={16} />
      </button>
    </div>
  );

  const renderSubscriptionContent = () => {
    const plans = [
      { 
        name: "Free", 
        popular: false,
        price: "0đ", 
        features: [
          { text: "Có quảng cáo", available: true },
          { text: "HD (720p)", available: true },
          { text: "Giới hạn 5 phim/ngày", available: true },
          { text: "Không hỗ trợ tải xuống", available: false },
          { text: "Không xem trước nội dung mới", available: false }
        ]
      },
      {
        name: "VIP", 
        popular: true,
        price: "79.000đ/tháng", 
        features: [
          { text: "Không quảng cáo", available: true },
          { text: "4K Ultra HD", available: true },
          { text: "Không giới hạn nội dung", available: true },
          { text: "Tải xuống xem offline", available: true },
          { text: "Xem trước nội dung mới", available: true }
        ]
      }
    ];

    const activePlan = user.isVip ? "VIP" : "Free";
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CreditCard size={24} className="text-red-500" /> 
          Gói dịch vụ
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map(plan => (
            <div key={plan.name} className={`relative bg-gray-800/80 p-8 rounded-3xl text-center border ${plan.name === activePlan ? 'border-red-600' : 'border-gray-700'} shadow-2xl`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-1 rounded-full text-sm font-bold">
                  Phổ biến
                </div>
              )}
              
              {plan.name === activePlan && (
                <div className="absolute -top-4 right-6 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <CheckCircle size={14} /> Đang sử dụng
                </div>
              )}
              
              <div className={`inline-flex justify-center items-center w-16 h-16 rounded-full mb-4 ${plan.name === "VIP" ? "bg-red-600/20" : "bg-gray-700/50"}`}>
                {plan.name === "VIP" ? (
                  <Star size={32} className="text-red-500" />
                ) : (
                  <User size={32} className="text-gray-400" />
                )}
              </div>
              
              <h3 className={`text-3xl font-bold mb-2 ${plan.name === "VIP" ? "text-red-500" : ""}`}>{plan.name}</h3>
              <p className="text-2xl mb-6">{plan.price}</p>
              
              <ul className="space-y-4 mb-8 text-left">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    {feature.available ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <X size={18} className="text-gray-500" />
                    )}
                    <span className={feature.available ? "text-white" : "text-gray-500"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              {plan.name === "VIP" && !user.isVip && (
                <button className="w-full py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                  <Plus size={18} /> Nâng cấp ngay
                </button>
              )}
              
              {plan.name === "Free" && user.isVip && (
                <button className="w-full py-3 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-gray-300">
                  Downgrade
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mt-8">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Shield size={20} className="text-red-500" /> 
            Lợi ích VIP
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-800/80 p-4 rounded-lg flex items-start gap-3">
              <div className="bg-red-600/20 p-2 rounded-lg">
                <Download size={18} className="text-red-500" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Tải xuống</h4>
                <p className="text-sm text-gray-400">Xem offline khi không có mạng</p>
              </div>
            </div>
            
            <div className="bg-gray-800/80 p-4 rounded-lg flex items-start gap-3">
              <div className="bg-red-600/20 p-2 rounded-lg">
                <Film size={18} className="text-red-500" />
              </div>
              <div>
                <h4 className="font-bold mb-1">4K Ultra HD</h4>
                <p className="text-sm text-gray-400">Chất lượng hình ảnh cao nhất</p>
              </div>
            </div>
            
            <div className="bg-gray-800/80 p-4 rounded-lg flex items-start gap-3">
              <div className="bg-red-600/20 p-2 rounded-lg">
                <Calendar size={18} className="text-red-500" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Nội dung mới</h4>
                <p className="text-sm text-gray-400">Xem trước phim mới sớm nhất</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHistoryContent = () => {
    if (historyList.length === 0) {
      return renderEmptyState("Bạn chưa có lịch sử xem nào", <Clock size={36} className="text-gray-400" />);
    }
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Clock size={24} className="text-red-500" /> 
          Lịch sử xem của bạn
        </h2>
        
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {historyList.map(renderMediaCard)}
        </div>
      </div>
    );
  };
  
  const renderFavouritesContent = () => {
    if (favList.length === 0) {
      return renderEmptyState("Bạn chưa yêu thích nội dung nào", <Heart size={36} className="text-gray-400" />);
    }
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart size={24} className="text-red-500" /> 
          Danh sách yêu thích
        </h2>
        
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {favList.map(item => renderMediaCard(item, true))}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-gray-600 border-t-red-600 rounded-full" />
        </div>
      );
    }
    
    if (activeTab === "profile") return renderProfileContent();
    if (activeTab === "history") return renderHistoryContent();
    if (activeTab === "favourites") return renderFavouritesContent();
    if (activeTab === "subscription") return renderSubscriptionContent();
    
    return null;
  };

  // ---------------- SINGLE-TAB VIEW FOR SUBSCRIPTION -------------
  if (activeTab === "subscription" && window.innerWidth < 768) {
    return (
      <>
        <Navbar />
        <div className="relative top-20 min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col justify-center p-4 pb-16">
          {/* Return button */}
          <button
            onClick={() => setActiveTab("profile")}
            className="fixed top-24 left-4 flex items-center gap-2 text-gray-200 hover:text-white bg-gray-800/80 p-2 rounded-lg z-50"
          >
            <ArrowLeft size={20} /> Quay lại
          </button>
          
          <div className="mt-12 container mx-auto">
            {renderSubscriptionContent()}
          </div>
        </div>
      </>
    );
  }

  // ---------------- FULL PROFILE LAYOUT --------------------------
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-8 px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="relative rounded-2xl overflow-visible mb-24 shadow-xl h-64 bg-gradient-to-r from-gray-900 via-red-900 to-gray-900">
            {/* Background elements */}
            <div className="absolute inset-0 bg-black opacity-40" />
            <div className="absolute inset-0 bg-[url('/path-to-texture.png')] opacity-20 mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />
            
            {/* Decorative elements */}
            <div className="absolute top-8 right-16 w-32 h-32 rounded-full bg-red-600/20 filter blur-3xl"></div>
            <div className="absolute top-16 left-16 w-24 h-24 rounded-full bg-red-700/30 filter blur-2xl"></div>

            {/* AVATAR */}
            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="relative group">
                <div className="w-36 h-36 rounded-full border-4 border-gray-900 overflow-hidden shadow-2xl group-hover:border-red-600 transition-all duration-300">
                  <img 
                    src={avatarPreview || "/default-avatar.png"} 
                    alt="avatar" 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div 
                  onClick={() => fileInputRef.current.click()} 
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Camera size={24} className="text-white" />
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </div>
              
              <div className="ml-5 mb-9 gap-2">
                <h2 className="text-3xl font-bold">{user.username}</h2>
                <p className="text-gray-300">{user.email}</p>
                {user.isVip && (
                  <div className="mt-3 inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />VIP Member
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="absolute bottom-0 right-6 flex gap-3">
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="px-4 py-2 bg-gray-800/90 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  <Edit3 size={16} /> Chỉnh sửa
                </button>
              )}
                
              <button 
                onClick={() => { logout(); window.location.href = "/"; }} 
                className="px-4 py-2 bg-red-600/90 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <LogOut size={16} /> Đăng xuất
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* SIDEBAR */}
            <div className="bg-gray-800/80 p-4 rounded-xl md:w-64 flex flex-row md:flex-col gap-2 shadow-xl border border-gray-700/50 h-fit">
              {tabs.map((t) => (
                <button 
                  key={t.key} 
                  onClick={() => setActiveTab(t.key)} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === t.key 
                      ? "bg-gradient-to-r from-red-700 to-red-600 text-white font-medium shadow-lg" 
                      : "text-gray-300 hover:bg-gray-700/70"
                  }`}
                >
                  <span className={activeTab === t.key ? "text-white" : "text-red-500"}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
            
            {/* MAIN CONTENT */}
            <div className="flex-1 bg-gray-800/80 p-6 md:p-8 rounded-xl shadow-xl border border-gray-700/50">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}