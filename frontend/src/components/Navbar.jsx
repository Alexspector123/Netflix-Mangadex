import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  ChevronDown, 
  X,
  User
} from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuthStore();
  const { setContentType } = useContentStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black bg-opacity-95 shadow-lg" : "bg-gradient-to-b from-black to-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
        <div className="flex items-center gap-10">
          <Link to="/" className="transition-transform hover:scale-105">
            <img src="/netflix-logo.png" alt="Netflix Logo" className="w-32 sm:w-40" />
          </Link>

          {/* Desktop navbar items */}
          <div className="hidden md:flex gap-6 items-center">
            {/* Home Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-red-500 transition-colors">
                <Home className="size-4" />
                <span>Home</span>
                <ChevronDown className="size-4" />
              </button>
              <div className="absolute hidden group-hover:block bg-black bg-opacity-90 shadow-md rounded-md mt-1 p-1 border border-gray-800 w-36 transition-all">
                <button
                  onClick={() => {
                    setContentType("movie");
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left transition-colors"
                >
                  <Film className="size-4" />
                  <span>Movies</span>
                </button>
                <button
                  onClick={() => {
                    setContentType("tv");
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left transition-colors"
                >
                  <Tv className="size-4" />
                  <span>TV Shows</span>
                </button>
              </div>
            </div>

            {/* History Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-red-500 transition-colors">
                <History className="size-4" />
                <span>History</span>
                <ChevronDown className="size-4" />
              </button>
              <div className="absolute hidden group-hover:block bg-black bg-opacity-90 shadow-md rounded-md mt-1 p-1 border border-gray-800 w-36 transition-all">
                <button
                  onClick={() => (window.location.href = "/favourite")}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left transition-colors"
                >
                  <Heart className="size-4" />
                  <span>Favorites</span>
                </button>
                <button
                  onClick={() => (window.location.href = "/history")}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left transition-colors"
                >
                  <Search className="size-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5 items-center">
          <Link to="/search" className="hover:text-red-500 transition-colors">
            <Search className="size-5 hover:scale-110 transition-transform" />
          </Link>
          
          <div className="relative group">
            <Link to="/notification" className="relative hover:text-red-500 transition-colors">
              <Bell className="size-5 hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-red-600 rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
            </Link>
          </div>
          
          <div className="relative group">
            <Link to="/user">
              <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-transparent hover:border-red-500 transition-all">
                <img src={user.image} alt="Avatar" className="h-full w-full object-cover" />
              </div>
            </Link>
            <div className="absolute hidden group-hover:block right-0 bg-black bg-opacity-90 shadow-md rounded-md mt-1 p-1 border border-gray-800 w-36 transition-all">
              <button
                onClick={() => (window.location.href = "/profile")}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left transition-colors"
              >
                <User className="size-4" />
                <span>Profile</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-800 rounded text-left transition-colors"
              >
                <LogOut className="size-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
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
              <Link to="/" className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors" onClick={() => {setContentType("movie"); toggleMobileMenu();}}>
                <Film className="size-5" />
                <span>Movies</span>
              </Link>
              <Link to="/" className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors" onClick={() => {setContentType("tv"); toggleMobileMenu();}}>
                <Tv className="size-5" />
                <span>TV Shows</span>
              </Link>
              <Link to="/favourite" className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors" onClick={toggleMobileMenu}>
                <Heart className="size-5" />
                <span>Favorites</span>
              </Link>
              <Link to="/history" className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors" onClick={toggleMobileMenu}>
                <History className="size-5" />
                <span>Search History</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors" onClick={toggleMobileMenu}>
                <User className="size-5" />
                <span>Profile</span>
              </Link>
              <button className="flex items-center gap-2 p-3 hover:bg-gray-800 rounded-md transition-colors text-left" onClick={() => {logout(); toggleMobileMenu();}}>
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