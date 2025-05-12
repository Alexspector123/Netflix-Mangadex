// src/pages/HomeScreen/HomeScreen.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Info, Play, CirclePlus } from "lucide-react";
import useGetTrendingContent from "../../hooks/movie/useGetTrendingContent.jsx";
import {
  MOVIE_CATEGORIES,
  TV_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
} from "../../utils/constants.js";
import { useContentStore } from "../../store/content.js";
import MovieSlider from "../../components/MovieSlider";
import axios from "axios";
import toast from "react-hot-toast";
import AdPopup from "../../components/AdPopup";

export default function HomeScreen() {
  const navigate = useNavigate();
  const { contentType } = useContentStore();
  const { main, others } = useGetTrendingContent();

  // State để hiển thị & swap khi click thumbnail
  const [currentMain, setCurrentMain] = useState(null);
  const [currentOthers, setCurrentOthers] = useState([]);

  // UI flags
  const [imgLoading, setImgLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showVipAd, setShowVipAd] = useState(false);

  // Khi hook trả về dữ liệu, khởi tạo local state
  useEffect(() => {
    if (main) {
      setCurrentMain(main);
      setCurrentOthers(others);
      setIsFavourite(false);
      setImgLoading(true);
    }
  }, [main, others]);

  // Hiển thị popup VIP lần đầu
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && !user.isVip) {
      setShowVipAd(true);
    }
  }, []);

  const handleAddToFavourites = async () => {
    try {
      const payload = {
        id: currentMain.id,
        image: currentMain.poster_path || currentMain.backdrop_path,
        title: currentMain.title || currentMain.name,
        type: contentType,
      };
      await axios.post("/api/v1/search/favourite", payload).catch((err) => {
        if (err.response?.status === 403) {
          toast.error("Only VIP accounts can save favourites");
          navigate("/profile");
        } else throw err;
      });
      setIsFavourite(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleThumbnailClick = (item) => {
    // Swap hero <-> thumbnail
    setCurrentOthers((prev) =>
      prev.map((m) => (m.id === item.id ? currentMain : m))
    );
    setCurrentMain(item);
    setIsFavourite(false);
    setImgLoading(true);
  };

  const handleClosePopup = () => {
    setShowVipAd(false);
    localStorage.setItem("vipAdClosed", "true");
  };

  // Loading skeleton
  if (!currentMain) {
    return (
      <div className="h-screen text-white relative">
        <Navbar />
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center shimmer" />
      </div>
    );
  }

  return (
    <>
      {/* VIP Popup */}
      {showVipAd && !localStorage.getItem("vipAdClosed") && (
        <AdPopup
          onClose={handleClosePopup}
          onSignUp={() => (window.location.href = "/register-vip")}
        />
      )}

      {/* HERO */}
      <div className="relative h-screen text-white">
        <Navbar />

        {/* Backdrop & overlay */}
        {imgLoading && (
          <div className="absolute inset-0 bg-black/70 shimmer" />
        )}
        <img
          src={ORIGINAL_IMG_BASE_URL + currentMain.backdrop_path}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
          onLoad={() => setImgLoading(false)}
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Info block */}
        <div className="relative z-10 px-5 md:px-10 lg:px-20 py-60 max-w-4xl gap-4 flex flex-col">
          <h1 className="text-6xl font-extrabold ">
            {currentMain.title || currentMain.name}
          </h1>

          <div className="flex flex-wrap gap-2 mt-2 text-sm">
            <span className="px-2 py-1 bg-yellow-500 rounded">
              IMDb {currentMain.vote_average.toFixed(1)}
            </span>
            <span className="px-2 py-1 bg-gray-800 rounded">
              {currentMain.adult ? "18+" : "PG-13"}
            </span>
            <span className="px-2 py-1 bg-gray-800 rounded">
              {(
                currentMain.release_date?.slice(0, 4) ||
                currentMain.first_air_date.slice(0, 4)
              )}
            </span>
            {currentMain.number_of_seasons && (
              <span className="px-2 py-1 bg-gray-800 rounded">
                Seasons: {currentMain.number_of_seasons}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2 text-sm">
            {(currentMain.genres || []).map((g) => (
              <span key={g.id} className="px-2 py-1 bg-gray-700 rounded">
                {g.name}
              </span>
            ))}
          </div>

          <p className="mt-4 text-lg">
            {currentMain.overview.length > 200
              ? currentMain.overview.slice(0, 200) + "..."
              : currentMain.overview}
          </p>

          <div className="flex gap-4 mt-6">
            <Link
              to={`/watch/${currentMain.id}`}
              className="bg-gray-500/70 text-white py-2 px-4 rounded flex items-center hover:bg-red-500 hover:text-black"
            >
              <Play className="mr-2" /> Play
            </Link>

            <Link
              to={`/watch/${currentMain.id}`}
              className="bg-gray-500/70 text-white py-2 px-4 rounded flex items-center hover:bg-red-500 hover:text-black"
            >
              <Info className="mr-2" /> More Info
            </Link>

            {!isFavourite && (
              <button
                onClick={handleAddToFavourites}
                className="text-white py-2 px-4 rounded flex items-center hover:text-red-500"
              >
                <CirclePlus className="mr-2" />
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail strip (bottom-right) */}
        <div className="hidden md:flex absolute bottom-8 right-8 gap-3 z-20">
          {currentOthers.map((item) => (
            <button
              key={item.id}
              onClick={() => handleThumbnailClick(item)}
              className="w-28 h-16 border-2 border-transparent hover:border-white rounded overflow-hidden transition"
            >
              <img
                src={
                  ORIGINAL_IMG_BASE_URL +
                  (item.backdrop_path || item.poster_path)
                }
                alt={item.title || item.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY SLIDERS */}
      <div className="flex flex-col gap-25 bg-black py-10">
        {(contentType === "movie" ? MOVIE_CATEGORIES : TV_CATEGORIES).map(
          (category) => (
            <MovieSlider key={category} category={category} />
          )
        )}
      </div>
    </>
  );
}
