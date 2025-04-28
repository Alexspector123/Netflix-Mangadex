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
} from "lucide-react";

const tabs = [
  { key: "profile", label: "Thông tin", icon: <User size={18} /> },
  { key: "history", label: "Lịch sử xem", icon: <Clock size={18} /> },
  { key: "favourites", label: "Yêu thích", icon: <Heart size={18} /> },
  { key: "subscription", label: "Gói", icon: <CreditCard size={18} /> },
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
      { label: "Tên", value: profileData.name, name: "name", icon: <User size={16} /> },
      { label: "Email", value: profileData.email, name: "email", icon: <Mail size={16} /> },
      { label: "Ngôn ngữ", value: profileData.language, name: "language", icon: <Globe size={16} /> },
    ];
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.label} className="bg-gray-800/70 p-5 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm">{f.icon}{f.label}</div>
            {isEditing && f.name === "language" ? (
              <select
                name="language"
                value={profileData.language}
                onChange={(e) => setProfileData((p) => ({ ...p, language: e.target.value }))}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500"
              >
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="English">English</option>
                {/* Thêm option khác nếu cần */}
              </select>
            ) : isEditing && f.name ? (
              <input
                type="text"
                name={f.name}
                value={profileData[f.name]}
                onChange={(e) => setProfileData((p) => ({ ...p, [e.target.name]: e.target.value }))}
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <p className="text-white text-lg font-medium">{f.value || "—"}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMediaCard = (item, isFav = false) => (
    <div
      key={item.id}
      className="relative bg-gray-800/70 rounded-xl overflow-hidden shadow-lg border border-gray-700/50 group"
    >
      <img
        src={item.image ? `https://image.tmdb.org/t/p/w300${item.image}` : "/placeholder.png"}
        alt={item.title}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h5 className="text-white font-medium text-lg mb-1 line-clamp-1">{item.title}</h5>
        {item.rating && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Star size={14} className="text-yellow-500" />
            <span>{item.rating}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderEmptyState = (msg, icon) => (
    <div className="flex flex-col items-center py-16 text-center gap-4">
      <div className="bg-gray-800/60 p-6 rounded-full">{icon}</div>
      <p className="text-gray-400 text-lg">{msg}</p>
      <button className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700">Khám phá nội dung<ArrowRight size={16} /></button>
    </div>
  );

  const renderSubscriptionContent = () => {
    const plan = user.isVip
      ? { name: "VIP", price: "79.000đ/tháng", features: ["Không quảng cáo", "4K", "Không giới hạn", "Tải xuống"] }
      : { name: "Free", price: "0đ", features: ["Có quảng cáo", "HD", "Giới hạn 5 phim/ngày"] };
    return (
      <div className="max-w-md mx-auto bg-gray-800/80 p-8 rounded-3xl text-center border border-red-700 shadow-2xl">
        <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
        <p className="text-2xl mb-6">{plan.price}</p>
        <ul className="space-y-3 mb-8 text-left">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /><span>{f}</span></li>
          ))}
        </ul>
        {!user.isVip && <button className="w-full py-3 bg-red-600 rounded-lg hover:bg-red-700">Nâng cấp ngay</button>}
      </div>
    );
  };

  const renderTabContent = () => {
    if (isLoading) return <div className="flex justify-center py-16"><div className="animate-spin w-12 h-12 border-b-2 border-red-500 rounded-full" /></div>;
    if (activeTab === "profile") return renderProfileContent();
    if (activeTab === "history") return historyList.length ? <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{historyList.map(renderMediaCard)}</div> : renderEmptyState("Bạn chưa có lịch sử xem nào", <Clock size={32} className="text-gray-500" />);
    if (activeTab === "favourites") return favList.length ? <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{favList.map((i) => renderMediaCard(i, true))}</div> : renderEmptyState("Bạn chưa yêu thích nội dung nào", <Heart size={32} className="text-gray-500" />);
    if (activeTab === "subscription") return renderSubscriptionContent();
    return null;
  };

  // ---------------- SINGLE-TAB VIEW FOR SUBSCRIPTION -------------
  if (activeTab === "subscription") {
    return (
      <>
        <Navbar />
        <div className="relative top-20 min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center p-4">
          {/* Return button */}
          <button
            onClick={() => setActiveTab("profile")}
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-200 hover:text-white"
          ><ArrowLeft size={20} /> Quay lại
          </button>
          {renderSubscriptionContent()}
        </div>
      </>
    );
  }

  // ---------------- FULL PROFILE LAYOUT --------------------------
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-8 px-4 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          {/* HEADER */}
          <div className="relative rounded-2xl overflow-visible mb-20 shadow-xl h-64 bg-gradient-to-r from-red-900 via-red-700 to-red-800">
            <div className="absolute inset-0 bg-black opacity-30" />
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />

            {/* AVATAR */}
            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="relative group">
                <div className="w-36 h-36 rounded-full border-4 border-gray-900 overflow-hidden shadow-xl group-hover:border-red-600">
                  <img src={avatarPreview || "/default-avatar.png"} alt="avatar" className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                </div>
                <div onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                  <Camera size={24} className="text-white" />
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
              </div>
              <div className="ml-5 mb-9 gap-2">
                <h2 className="text-3xl font-bold">{user.username}</h2>
                <p className="text-gray-300">{user.email}</p>
                {user.isVip && <div className="mt-3 inline-flex items-center gap-1 bg-red-600/90 px-3 py-2 rounded-full text-sm"><Star size={14} />VIP Member</div>}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="absolute top-10 right-6 flex gap-3">
              <button onClick={() => setIsEditing((v) => !v)} className="p-2 bg-gray-900/80 rounded-full hover:bg-gray-800 tooltip-wrapper"><Edit3 size={18} /><span className="tooltip">Chỉnh sửa</span></button>
              {isEditing && <button onClick={handleSave} className="p-2 bg-red-600 rounded-full hover:bg-red-700 tooltip-wrapper"><CheckCircle size={18} /><span className="tooltip">Lưu</span></button>}
              <button onClick={() => { logout(); window.location.href = "/"; }} className="p-2 bg-gray-900/80 rounded-full hover:bg-gray-800 tooltip-wrapper"><LogOut size={18} /><span className="tooltip">Đăng xuất</span></button>
            </div>
          </div>

          {/* BODY */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-gray-800/80 p-3 rounded-xl md:w-56 flex gap-2 md:flex-col shadow-xl border border-gray-700/50">
              {tabs.filter((t) => t.key !== "subscription").map((t) => (
                <button key={t.key} onClick={() => setActiveTab(t.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === t.key ? "bg-gradient-to-r from-red-700 to-red-600 text-white" : "text-gray-400 hover:bg-gray-700/70"}`}>{t.icon}{t.label}</button>
              ))}
              <button onClick={() => setActiveTab("subscription")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-700/70"><CreditCard size={18} />Gói</button>
            </div>
            <div className="flex-1 bg-gray-800/80 p-8 rounded-xl shadow-xl border border-gray-700/50">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* TOOLTIP CSS */}
      <style jsx>{`
        .tooltip-wrapper{position:relative}
        .tooltip{position:absolute;top:110%;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#fff;font-size:12px;padding:4px 8px;border-radius:4px;white-space:nowrap;opacity:0;visibility:hidden;transition:all .2s}
        .tooltip-wrapper:hover .tooltip{opacity:1;visibility:visible}
      `}</style>
    </>
  );
}
