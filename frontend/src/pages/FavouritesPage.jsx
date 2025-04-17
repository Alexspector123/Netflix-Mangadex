import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { Trash, Heart, Clock, Search, Film, Tv, Calendar, X, Filter, ChevronDown, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function formatDate(dateString) {
  // Create a Date object from the input date string
  const date = new Date(dateString);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Extract the month, day, and year from the Date object
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  // Return the formatted date string
  return `${month} ${day}, ${year}`;
}

const FavouritesPage = () => {
  const [favouritesHistory, setFavouritesHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const navigate = useNavigate();   

  useEffect(() => {
    const getFavouritesHistory = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/v1/search/favourite`);
        setFavouritesHistory(res.data.content);
      } catch (error) {
        setFavouritesHistory([]);
        toast.error("Failed to load favourites");
      } finally {
        setIsLoading(false);
      }
    };
    getFavouritesHistory();
  }, []);

  const handleDelete = async (entry, e) => {
    e.stopPropagation();
    try {
      await toast.promise(
        axios.delete(`/api/v1/search/favourite/${entry.id}`),
        {
          loading: 'Removing from favourites...',
          success: 'Removed from favourites!',
          error: 'Failed to remove'
        }
      );
      setFavouritesHistory(favouritesHistory.filter((item) => item.id !== entry.id));
    } catch (error) {
      console.error("Failed to delete favourite item", error);
    }
  };

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete all favourites?");
    if (!confirmDelete) return;

    try {
      await toast.promise(
        axios.delete(`/api/v1/search/favourite`),
        {
          loading: 'Deleting all favourites...',
          success: 'All favourites deleted!',
          error: 'Failed to delete all favourites',
        }
      );
      setFavouritesHistory([]);
    } catch (error) {
      console.error("Failed to delete all favourites", error);
    }
  };

  const handleCardClick = (entry) => {
    navigate(`/watch/${entry.id}`); 
  };

  const filteredItems = filter === "all"
    ? favouritesHistory
    : favouritesHistory.filter(item => item.searchType === filter);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
          <div className="flex justify-center items-center h-96">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xl font-medium">Loading favourites...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Header with filters and edit button */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="size-7 text-white" />
            <h1 className="text-3xl font-bold">My Favourites</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setShowFilterMenu(!showFilterMenu)}
              >
                <Filter size={16} />
                <span>
                  Filter:{" "}
                  {filter === "all" ? "All" : filter === "movie" ? "Movies" : "TV Shows"}
                </span>
                <ChevronDown size={16} />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-10 w-48">
                  {["all", "movie", "tv"].map((type) => (
                    <button
                      key={type}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 ${filter === type ? "bg-gray-700" : ""
                        }`}
                      onClick={() => {
                        setFilter(type);
                        setShowFilterMenu(false);
                      }}
                    >
                      {type === "movie" && <Film size={14} />}
                      {type === "tv" && <Tv size={14} />}
                      <span>
                        {type === "all" ? "All" : type === "movie" ? "Movies" : "TV Shows"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Edit/Delete toggle */}
            <button
              className= "px-4 py-2 rounded-md transition-colors flex items-center gap-2 bg-gray-800 hover:bg-gray-700"
              onClick={() => handleDeleteAll()}
            >
              <Trash size={16} />
              <span>Delete All</span>
            </button>
          </div>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="bg-gray-900 bg-opacity-40 rounded-xl p-12 flex flex-col items-center justify-center h-80">
            <Heart size={48} className="text-gray-600 mb-4" />
            <h2 className="text-2xl font-medium mb-2">No favourites found</h2>
            <p className="text-gray-400 text-center max-w-md mb-6">
              Your favourite movies and TV shows will appear here when you add them
            </p>
            <a
              href="/"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center gap-2"
            >
              <Search size={18} />
              <span>Browse content</span>
            </a>
          </div>
        )}

        {/* Grid of favourites */}
        {filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((entry) => (
              <div
                key={entry.id}
                className={`bg-gray-900 rounded-lg overflow-hidden transition-transform hover:scale-105 shadow-lg ${!isDeleteMode ? "cursor-pointer" : ""
                  }`}
                onClick={() => !isDeleteMode && handleCardClick(entry)}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={SMALL_IMG_BASE_URL + entry.image}
                    alt={entry.title}
                    className="w-full h-full object-cover transition-transform hover:scale-110"
                  />

                  {/* Top label & delete button */}
                  <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black to-transparent">
                    <div className="flex justify-between items-center">
                      <span
                        className={`py-1 px-3 rounded-full text-xs font-medium ${entry.searchType === "movie" ? "bg-red-600" : "bg-blue-600"
                          }`}
                      >
                        <span className="flex items-center gap-1">
                          {entry.searchType === "movie" ? (
                            <>
                              <Film size={12} />
                              Movie
                            </>
                          ) : (
                            <>
                              <Tv size={12} />
                              TV Show
                            </>
                          )}
                        </span>
                      </span>

                      {isDeleteMode && (
                        <button
                          className="p-2 bg-black bg-opacity-70 rounded-full hover:bg-red-600 transition-colors"
                          onClick={(e) => handleDelete(entry, e)}
                        >
                          <Trash size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hover preview button */}
                  {!isDeleteMode && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <button className="p-3 bg-red-600 rounded-full transform scale-75 hover:scale-100 transition-transform">
                        <Eye size={20} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Card bottom content */}
                <div className="p-4">
                  <h3 className="font-medium text-lg line-clamp-1 mb-1">{entry.title}</h3>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(entry.createdAt)}
                    </span>

                    {!isDeleteMode && (
                      <button
                        className="text-red-500 hover:text-red-400"
                        onClick={(e) => handleDelete(entry, e)}
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FavouritesPage;