import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  Menu,
  Search,
  Bell,
  Home,
  Film,
  Tv,
  Heart,
  History,
  X,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "../store/authUser.js";
import { useContentStore } from "../store/content.js";

const Navbar = () => {
  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const { setContentType } = useContentStore();
  const navigate = useNavigate();

  // refs cho outside‑click
  const homeRef = useRef(null);
  const historyRef = useRef(null);
  const profileRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (homeRef.current && !homeRef.current.contains(e.target)) setHomeOpen(false);
      if (historyRef.current && !historyRef.current.contains(e.target)) setHistoryOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Thay đổi background khi scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle helpers
  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);
  const toggleHome = () => setHomeOpen((open) => !open);
  const toggleHistory = () => setHistoryOpen((open) => !open);
  const toggleProfile = () => setProfileOpen((open) => !open);

  // Chọn content type
  const handleSelect = (type) => {
    setContentType(type); // cập nhật store
    navigate("/"); // về trang chính
    // đóng các menu
    setHomeOpen(false);
    setHistoryOpen(false);
    setProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black bg-opacity-95 shadow-lg"
          : "bg-gradient-to-b from-black to-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
        {/* Logo & desktop nav */}
        <div className="flex items-center gap-10">
          <Link to="/" className="transition-transform hover:scale-105">
            <img src="/netflix-logo.png" alt="Netflix Logo" className="w-32 sm:w-40" />
          </Link>

          {/* Desktop dropdowns */}
          <div className="hidden md:flex gap-6 items-center">
            {/* Home Dropdown */}
            <div className="relative" ref={homeRef}>
              <button
                onClick={toggleHome}
                className="flex items-center gap-1 text-sm font-medium hover:text-red-500 transition-colors cursor-pointer"
              >
                <Home className="size-4" />
                <span>Home</span>
                {homeOpen ? <X className="size-4" /> : <ChevronDown className="size-4" />}
              </button>

              {homeOpen && (
                <div className="absolute bg-black bg-opacity-90 shadow-md rounded-md mt-1 p-1 border border-gray-800 w-36 cursor-pointer">
                  <button
                    onClick={() => handleSelect("movie")}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left"
                  >
                    <Film className="size-4" />
                    <span>Movies</span>
                  </button>
                  <button
                    onClick={() => handleSelect("tv")}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left"
                  >
                    <Tv className="size-4" />
                    <span>TV Shows</span>
                  </button>
                </div>
              )}
            </div>

            {/* History Dropdown */}
            <div className="relative" ref={historyRef}>
              <button
                onClick={toggleHistory}
                className="flex items-center gap-1 text-sm font-medium hover:text-red-500 transition-colors cursor-pointer"
              >
                <History className="size-4" />
                <span>History</span>
                {historyOpen ? <X className="size-4" /> : <ChevronDown className="size-4" />}
              </button>

              {historyOpen && (
                <div className="absolute bg-black bg-opacity-90 shadow-md rounded-md mt-1 p-1 border border-gray-800 w-36 cursor-pointer">
                  <button
                    onClick={() => navigate("/favourite")}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left"
                  >
                    <Heart className="size-4" />
                    <span>Favorites</span>
                  </button>
                  <button
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left"
                  >
                    <Search className="size-4" />
                    <span>Search History</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex gap-5 items-center">
          <Link to="/search" className="hover:text-red-500 transition-colors">
            <Search className="size-5 hover:scale-110 transition-transform" />
          </Link>

          <Link to="/notification" className="relative hover:text-red-500 transition-colors">
            <Bell className="size-5 hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={toggleProfile}
              className="h-8 w-8 rounded-full overflow-hidden border-2 border-transparent hover:border-red-500 transition-all cursor-pointer"
            >
              <img src={user.image} alt="Avatar" className="h-full w-full object-cover" />
            </div>

            {profileOpen && (
              <div className="absolute right-0 bg-black bg-opacity-90 shadow-md rounded-md mt-1 p-1 border border-gray-800 w-36">
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left"
                >
                  <User className="size-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            {isMobileMenuOpen ? (
              <X className="size-6 cursor-pointer hover:text-red-500 transition-colors" onClick={toggleMobileMenu} />
            ) : (
              <Menu className="size-6 cursor-pointer hover:text-red-500 transition-colors" onClick={toggleMobileMenu} />
            )}
          </div>
        </div>

        {/* Mobile navbar items */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-0 right-0 w-full md:hidden bg-black bg-opacity-95 border-t border-gray-800 shadow-lg">
            <div className="p-4 max-w-6xl mx-auto flex flex-col gap-4">
              <button
                onClick={() => handleSelect("movie")}
                className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors"
              >
                <Film className="size-5" />
                <span>Movies</span>
              </button>
              <button
                onClick={() => handleSelect("tv")}
                className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors"
              >
                <Tv className="size-5" />
                <span>TV Shows</span>
              </button>
              <button
                onClick={() => { navigate("/favourite"); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors"
              >
                <Heart className="size-5" />
                <span>Favorites</span>
              </button>
              <button
                onClick={() => { navigate("/history"); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors"
              >
                <History className="size-5" />
                <span>Search History</span>
              </button>
              <Link
                to="/profile"
                className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors"
                onClick={toggleMobileMenu}
              >
                <User className="size-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
                className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors"
              >
                <LogOut className="size-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
