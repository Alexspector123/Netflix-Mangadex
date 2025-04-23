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
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.image);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setProfileData({
      name: user.username,
      email: user.email,
      phone: user.phone || "",
      plan: user.isVip ? "VIP" : "Free",
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
      } catch {
        /* ignore */
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleSave = () => {
    // TODO: call API
    setIsEditing(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
    const form = new FormData();
    form.append("avatar", file);
    try {
      await axios.post("/api/v1/user/avatar", form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const renderProfileContent = () => {
    if (!profileData) return null;
    const fields = [
      { label: "Tên", value: profileData.name, name: "name" },
      { label: "Email", value: profileData.email, name: "email" },
      { label: "Số điện thoại", value: profileData.phone, name: "phone" },
      { label: "Gói", value: profileData.plan },
      { label: "Ngôn ngữ", value: profileData.language },
    ];
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((f) => (
          <div
            key={f.label}
            className="bg-gray-800 p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <h4 className="text-gray-400 text-sm mb-2">{f.label}</h4>
            {isEditing && f.name ? (
              <input
                type="text"
                name={f.name}
                value={profileData[f.name]}
                onChange={(e) =>
                  setProfileData((p) => ({ ...p, [e.target.name]: e.target.value }))
                }
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-red-500"
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
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-red-900/30 transform hover:scale-105 transition"
    >
      <div className="relative">
        <img
          src={item.image ? `https://image.tmdb.org/t/p/w300${item.image}` : "/placeholder.png"}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-3">
        <h5 className="text-white font-medium">{item.title}</h5>
        {isFav && (
          <button className="mt-2 text-red-400 hover:text-red-600 text-sm flex items-center gap-1">
            <Heart size={14} /> Bỏ yêu thích
          </button>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (isLoading)
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-10 h-10 border-b-2 border-red-500 rounded-full" />
        </div>
      );

    switch (activeTab) {
      case "profile":
        return renderProfileContent();
      case "history":
        return historyList.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {historyList.map((i) => renderMediaCard(i))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">
            Bạn chưa có lịch sử xem nào
          </p>
        );
      case "favourites":
        return favList.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {favList.map((i) => renderMediaCard(i, true))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">
            Bạn chưa yêu thích nội dung nào
          </p>
        );
      case "subscription":
        return (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Free & VIP cards as before */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pt-8 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="relative rounded-2xl overflow-visible mb-20 shadow-xl h-64 bg-gradient-to-r from-red-900 via-red-700 to-red-800">
            <div className="absolute inset-0 bg-black opacity-30" />
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />

            {/* Avatar + Name */}
            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="relative">
                <div className="w-36 h-36 rounded-full border-4 border-gray-900 overflow-hidden shadow-lg">
                  <img
                    src={avatarPreview || "/default-avatar.png"}
                    alt="avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                 {/* hidden file input */}
                 <input
                 type="file"
                 accept="image/*"
                 ref={fileInputRef}
                 onChange={handleAvatarChange}
                  className="hidden"
                  />
              </div>
              <div className="ml-6 mb-6">
                <h2 className="text-3xl font-bold">{user.username}</h2>
                <p className="text-gray-300">{user.email}</p>
              </div>
            </div>

            {/* Edit / Save / Logout */}
            <div className="absolute bottom-6 right-6 flex items-center space-x-3">
              <button
                onClick={() => setIsEditing((e) => !e)}
                className="p-2 bg-gray-900 bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
              >
                <Edit3 size={18} />
              </button>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition"
                >
                  <CheckCircle size={18} />
                </button>
              )}
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-2 bg-gray-900 bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
              >
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* Tabs + Sidebar */}
          <div className="flex flex-col md:flex-row mb-8">
            <div className="bg-gray-800 rounded-xl p-2 flex md:flex-col gap-2 md:w-56 mb-6 md:mb-0 md:mr-6 shadow-lg">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg w-full transition ${
                    activeTab === t.key
                      ? "bg-red-600 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
              {/* logout moved up */}
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  {tabs.find((t) => t.key === activeTab)?.icon}
                  {tabs.find((t) => t.key === activeTab)?.label}
                </h3>
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
