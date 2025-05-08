import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight, Play, CirclePlus, Info } from "lucide-react";
import toast from "react-hot-toast";

const MovieSlider = ({ category }) => {
  const { contentType } = useContentStore();
  const [content, setContent] = useState([]);
  const [showArrows, setShowArrows] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [favourites, setFavourites] = useState(new Set());
  const [metadata, setMetadata] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const ITEMS_PER_SLIDE = 4;

  const formattedCategoryName =
    category.replaceAll("_", " ")[0].toUpperCase() +
    category.replaceAll("_", " ").slice(1);
  const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

  // Fetch list of movies/shows
  useEffect(() => {
    const getContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${category}`);
        setContent(res.data.content);
      } catch (err) {
        console.error(err);
      }
    };
    getContent();
  }, [contentType, category]);

  // Fetch details metadata for hover overlays
  useEffect(() => {
    if (!content.length) return;
    
    // Get the visible items based on current index
    const visibleItems = content.slice(currentIndex, currentIndex + ITEMS_PER_SLIDE);
    
    const toFetch = visibleItems.map(item =>
      axios
        .get(`/api/v1/${contentType}/${item.id}/details`)
        .then(res => ({ id: item.id, detail: res.data.content }))
        .catch(() => null)
    );
    
    Promise.all(toFetch).then(results => {
      const map = {};
      results.forEach(r => {
        if (r && r.detail) map[r.id] = r.detail;
      });
      setMetadata(prev => ({ ...prev, ...map }));
    });
  }, [content, contentType, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = Math.max(0, prevIndex - ITEMS_PER_SLIDE);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = Math.min(content.length - ITEMS_PER_SLIDE, prevIndex + ITEMS_PER_SLIDE);
      return newIndex;
    });
  };

  const handleAddToFavourites = async item => {
    try {
      await axios.post(
        "/api/v1/search/favourite",
        {
          id: item.id,
          image: item.poster_path || item.backdrop_path,
          title: item.title || item.name,
          type: contentType,
        }
      );
      toast.success("Added to favourites");
      setFavourites(prev => new Set(prev).add(item.id));
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Only VIP accounts can save favourites");
        navigate("/profile");
      } else {
        console.error(err);
        toast.error("An error occurred");
      }
    }
  };

  // Get visible content based on current index
  const visibleContent = content.slice(currentIndex, currentIndex + ITEMS_PER_SLIDE);

  return (
    <div
      className="bg-black text-white relative px-5 md:px-20"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="mb-4 text-2xl font-bold">
        {formattedCategoryName} {formattedContentType}
      </h2>

      <div className="relative">
        <div
          className="grid grid-cols-4 gap-4"
          ref={sliderRef}
        >
          {visibleContent.map(item => (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative min-w-[200px] max-w-[250px]"
            >
              <Link to={`/watch/${item.id}`}>              
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={SMALL_IMG_BASE_URL + item.backdrop_path}
                    alt="Movie image"
                    className="transition-transform duration-300 ease-in-out rounded-lg w-full h-auto"
                  />
                </div>
              </Link>

              <p className="mt-2 text-center text-sm font-medium">
                {item.title || item.name}
              </p>

              {hoveredId === item.id && (
                <div className="absolute inset-0 z-50 bg-black bg-opacity-75 rounded-lg transform scale-105 transition-all duration-200 p-4 flex flex-col justify-between">
                  <img
                    src={SMALL_IMG_BASE_URL + item.backdrop_path}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <div className="flex gap-4 mb-2 text-white">
                    <Link to={`/watch/${item.id}`}><Play className="cursor-pointer hover:text-red-500" /></Link>
                    {!favourites.has(item.id) && (
                      <CirclePlus
                        onClick={() => handleAddToFavourites(item)}
                        className="cursor-pointer hover:text-red-500"
                      />
                    )}
                    <Link to={`/watch/${item.id}`}><Info className="cursor-pointer hover:text-red-500" /></Link>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>{metadata[item.id]?.vote_average?.toFixed(1) ?? '–'}/10</span>
                    <span>{metadata[item.id]?.runtime ? `${metadata[item.id].runtime}m` : '–'}</span>
                    <span>{metadata[item.id]?.status ?? '–'}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {metadata[item.id]?.overview
                      ? `${metadata[item.id].overview.slice(0, 60)}${metadata[item.id].overview.length > 60 ? '...' : ''}`
                      : ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {showArrows && content.length > ITEMS_PER_SLIDE && (
          <>
            <button
              className="absolute top-1/2 -translate-y-1/2 -left-5 md:-left-10 flex items-center justify-center w-12 h-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute top-1/2 -translate-y-1/2 -right-5 md:-right-10 flex items-center justify-center w-12 h-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
              onClick={handleNext}
              disabled={currentIndex >= content.length - ITEMS_PER_SLIDE}
              style={{ opacity: currentIndex >= content.length - ITEMS_PER_SLIDE ? 0.5 : 1 }}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieSlider;