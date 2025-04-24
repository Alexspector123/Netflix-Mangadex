// src/pages/SearchPage.jsx
import { useState, useEffect, useRef } from "react";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { Search as SearchIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants.js";
import { Link, useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [activeTab, setActiveTab]     = useState("movie");
  const [searchTerm, setSearchTerm]   = useState("");
  const [results, setResults]         = useState([]);
  const { setContentType }            = useContentStore();
  const navigate                       = useNavigate();
  const debounceRef                   = useRef(null);

  // Change tabs & clear
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setContentType(tab);
    setSearchTerm("");
    setResults([]);
    navigate(`/search?query=`, { replace: true });
  };

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!searchTerm.trim()) return setResults([]);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `/api/v1/search/${activeTab}/${encodeURIComponent(searchTerm)}`
        );
        setResults(res.data.content || []);
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`, { replace: true });
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error("No results. Try a different category or keyword.");
        } else {
          toast.error("Search failed. Please try again.");
        }
        setResults([]);
      }
    }, 200);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, activeTab, navigate]);

  const placeholderImage = "/images/movie-placeholder.png";

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-20">
        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {["movie", "tv", "person"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`py-2 px-4 rounded ${
                activeTab === tab ? "bg-red-600" : "bg-gray-800"
              } hover:bg-red-700`}
            >
              {tab === "movie"
                ? "Movies"
                : tab === "tv"
                ? "TV Shows"
                : "People"}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="flex max-w-2xl mx-auto mb-12 gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search for ${activeTab}`}
            className="flex-1 p-2 rounded bg-gray-800 text-white focus:outline-none"
          />
          <button
            onClick={() => setSearchTerm(searchTerm.trim())}
            className="bg-red-600 hover:bg-red-700 px-4 rounded"
          >
            <SearchIcon size={20} />
          </button>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((item) => {
            // choose image & title
            const imgPath = item.poster_path || item.profile_path;
            const title   = item.title || item.name;
            // build detail link
            const to =
              activeTab === "movie"
                ? `/watch/${item.id}`
                : activeTab === "tv"
                ? `/watch/${item.id}`
                : `/people/${item.id}`;

            return (
              <Link
                key={item.id}
                to={to}
                onClick={() => setContentType(activeTab)}
                className="block bg-gray-800 rounded overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[2/3] bg-gray-700">
                  <img
                    src={
                      imgPath
                        ? ORIGINAL_IMG_BASE_URL + imgPath
                        : placeholderImage
                    }
                    alt={title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = placeholderImage;
                    }}
                  />
                </div>
                <h2 className="mt-2 px-2 pb-2 text-lg font-semibold truncate">
                  {title}
                </h2>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
