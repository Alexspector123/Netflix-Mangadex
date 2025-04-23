import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Info, Play, CirclePlus } from "lucide-react";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import { MOVIE_CATEGORIES, ORIGINAL_IMG_BASE_URL, TV_CATEGORIES } from "../../utils/constants.js";
import { useContentStore } from "../../store/content.js";
import MovieSlider from "../../components/MovieSlider";
import axios from "axios";
import toast from "react-hot-toast";
import AdPopup from "../../components/AdPopup"; // Import quảng cáo

const HomeScreen = () => {
  const { trendingContent } = useGetTrendingContent();
  const { contentType } = useContentStore();
  const [imgLoading, setImgLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [showVipAd, setShowVipAd] = useState(false);  // Quản lý popup quảng cáo

  useEffect(() => {
    setIsFavourite(false);
  }, [trendingContent, contentType]);

  useEffect(() => {
    // Kiểm tra nếu user đã đăng nhập và chưa đăng ký VIP
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && !user.isVip) {
      setShowVipAd(true); // Hiển thị quảng cáo nếu chưa là VIP
    }
  }, []);

  const handleAddToFavourites = async () => {
    try {
      const payload = {
        id: trendingContent?.id,
        image: trendingContent?.poster_path || trendingContent?.backdrop_path,
        title: trendingContent?.title || trendingContent?.name,
        type: contentType,
      };

      await axios.post("/api/v1/search/favourite", payload)
        .catch(err => {
          if (err.response?.status === 403) {
            toast.error("Only VIP accounts can save favourites");
            navigate("/profile");        // gợi ý nâng cấp
          } else throw err;
        });

      setIsFavourite(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUpVip = () => {
    // Đưa người dùng đến trang đăng ký VIP
    window.location.href = "/register-vip";
  };

  const handleClosePopup = () => {
    setShowVipAd(false);
    localStorage.setItem("vipAdClosed", "true"); // Lưu trạng thái popup đã đóng
  };

  if (!trendingContent)
    return (
      <div className="h-screen text-white relative">
        <Navbar />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer" />
      </div>
    );

  return (
    <>
      {showVipAd && !localStorage.getItem("vipAdClosed") && (
        <AdPopup onClose={handleClosePopup} onSignUp={handleSignUpVip} />
      )}

      <div className="relative h-screen text-white ">
        <Navbar />

        {imgLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10" />
        )}

        <img
          src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path}
          alt="Hero img"
          className="absolute top-0 left-0 w-full h-full object-cover -z-50"
          onLoad={() => setImgLoading(false)}
        />

        <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-50" aria-hidden="true" />

        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
          <div className="bg-gradient-to-b from-black via-transparent to-transparent absolute w-full h-full top-0 left-0 -z-10" />

          <div className="max-w-2xl">
            <h1 className="mt-4 text-6xl font-extrabold text-balance">
              {trendingContent?.title || trendingContent?.name}
            </h1>
            <p className="mt-2 text-lg">
              {trendingContent?.release_date?.split("-")[0] ||
                trendingContent?.first_air_date.split("-")[0]}{" "}
              | {trendingContent?.adult ? "18+" : "PG-13"}
            </p>

            <p className="mt-4 text-lg">
              {trendingContent?.overview.length > 200
                ? trendingContent?.overview.slice(0, 200) + "..."
                : trendingContent?.overview}
            </p>
          </div>

          <div className="flex mt-8">
            <Link
              to={`/watch/${trendingContent?.id}`}
              className="bg-white hover:bg-red-500 text-black font-bold py-2 px-4 rounded mr-4 flex items-center"
            >
              <Play className="size-6 mr-2 fill-black" />
              Play
            </Link>

            <Link
              to={`/watch/${trendingContent?.id}`}
              className="bg-gray-500/70 hover:bg-red-500 hover:text-black text-white py-2 px-4 rounded flex items-center"
            >
              <Info className="size-6 mr-2" />
              More Info
            </Link>

            {!isFavourite && (
              <button
                onClick={handleAddToFavourites}
                className="text-white py-2 px-4 rounded flex items-center hover:text-red-500 transition-colors"
              >
                <CirclePlus className="size-6 mr-2" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 bg-black py-10">
        {contentType === "movie"
          ? MOVIE_CATEGORIES.map((category) => (
            <MovieSlider key={category} category={category} />
          ))
          : TV_CATEGORIES.map((category) => (
            <MovieSlider key={category} category={category} />
          ))}
      </div>
    </>
  );
};

export default HomeScreen;
