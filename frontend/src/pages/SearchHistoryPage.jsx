import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { Trash, Clock, Heart, Search, Film, Tv, Calendar, X, Filter, ChevronDown, Eye } from "lucide-react";
import toast from "react-hot-toast";


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

const SearchHistoryPage = () => {
	const [searchHistory, setSearchHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState("all");
	const [showFilterMenu, setShowFilterMenu] = useState(false);
	const [isDeleteMode, setIsDeleteMode] = useState(false);
  
	useEffect(() => {
	  const getSearchHistory = async () => {
		setIsLoading(true);
		try {
		  const res = await axios.get(`/api/v1/search/history`);
		  setSearchHistory(res.data.content);
		} catch (error) {
		  setSearchHistory([]);
		  toast.error("Failed to load search history");
		} finally {
		  setIsLoading(false);
		}
	  };
	  getSearchHistory();
	}, []);
  
	const handleDelete = async (entry, e) => {
	  e && e.stopPropagation();
	  try {
		await toast.promise(
		  axios.delete(`/api/v1/search/history/${entry.id}`),
		  {
			loading: 'Removing search history...',
			success: 'Search history removed!',
			error: 'Failed to remove'
		  }
		);
		setSearchHistory(searchHistory.filter((item) => item.id !== entry.id));
	  } catch (error) {
		console.error("Failed to delete search item", error);
	  }
	};
  
	const handleCardClick = (entry) => {
	  // Navigate to content page
	  console.log("Navigating to:", entry.title);
	  // window.location.href = `/${entry.searchType}/${entry.id}`;
	};
  
	const clearAllHistory = async () => {
	  if (confirm("Are you sure you want to clear all search history?")) {
		try {
		  await toast.promise(
			axios.delete(`/api/v1/search/history`),
			{
			  loading: 'Clearing search history...',
			  success: 'Search history cleared!',
			  error: 'Failed to clear search history'
			}
		  );
		  setSearchHistory([]);
		} catch (error) {
		  console.error("Failed to clear search history", error);
		}
	  }
	};
  
	const filteredItems = filter === "all" 
	  ? searchHistory 
	  : searchHistory.filter(item => item.searchType === filter);
  
	if (isLoading) {
	  return (
		<div className="bg-black min-h-screen text-white">
		  <Navbar />
		  <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
			<div className="flex justify-center items-center h-96">
			  <div className="flex flex-col items-center">
				<div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
				<p className="text-xl font-medium">Loading search history...</p>
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
		  {/* Header section with filters */}
		  <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div className="flex items-center gap-3">
			  <Clock className="size-7 white"/>
			  <h1 className="text-3xl font-bold">Search History</h1>
			</div>
			
			<div className="flex flex-wrap items-center gap-3">
			  <div className="relative">
				<button 
				  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
				  onClick={() => setShowFilterMenu(!showFilterMenu)}
				>
				  <Filter size={16} />
				  <span>Filter: {filter === "all" ? "All" : filter === "movie" ? "Movies" : "TV Shows"}</span>
				  <ChevronDown size={16} />
				</button>
				
				{showFilterMenu && (
				  <div className="absolute right-0 mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700 z-10 w-48">
					<button 
					  className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${filter === "all" ? "bg-gray-700" : ""}`}
					  onClick={() => {setFilter("all"); setShowFilterMenu(false);}}
					>
					  All
					</button>
					<button 
					  className={`w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 ${filter === "movie" ? "bg-gray-700" : ""}`}
					  onClick={() => {setFilter("movie"); setShowFilterMenu(false);}}
					>
					  <Film size={14} />
					  <span>Movies</span>
					</button>
					<button 
					  className={`w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 ${filter === "tv" ? "bg-gray-700" : ""}`}
					  onClick={() => {setFilter("tv"); setShowFilterMenu(false);}}
					>
					  <Tv size={14} />
					  <span>TV Shows</span>
					</button>
				  </div>
				)}
			  </div>
			  
			  <button 
				className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
				  isDeleteMode ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-700"
				}`}
				onClick={() => setIsDeleteMode(!isDeleteMode)}
			  >
				{isDeleteMode ? (
				  <>
					<X size={16} />
					<span>Cancel</span>
				  </>
				) : (
				  <>
					<Trash size={16} />
					<span>Edit</span>
				  </>
				)}
			  </button>
			  
			  {searchHistory.length > 0 && (
				<button 
				  className="px-4 py-2 bg-gray-800 hover:bg-red-700 rounded-md transition-colors flex items-center gap-2"
				  onClick={clearAllHistory}
				>
				  <X size={16} />
				  <span>Clear All</span>
				</button>
			  )}
			</div>
		  </div>
  
		  {/* No search history state */}
		  {filteredItems.length === 0 && (
			<div className="bg-gray-900 bg-opacity-40 rounded-xl p-12 flex flex-col items-center justify-center h-80">
			  <Search size={48} className="text-gray-600 mb-4" />
			  <h2 className="text-2xl font-medium mb-2">No search history</h2>
			  <p className="text-gray-400 text-center max-w-md mb-6">
				Your search history will appear here after you search for movies and TV shows
			  </p>
			  <a 
				href="/search"
				className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
			  >
				<Search size={18} />
				<span>Start searching</span>
			  </a>
			</div>
		  )}
  
		  {/* History items */}
		  {filteredItems.length > 0 && (
			<div className="space-y-4">
			  {filteredItems.map((entry) => (
				<div 
				  key={entry.id} 
				  className={`bg-gray-900 bg-opacity-60 hover:bg-opacity-80 rounded-lg overflow-hidden flex items-center transition-all ${!isDeleteMode ? "cursor-pointer hover:shadow-lg" : ""}`}
				  onClick={() => !isDeleteMode && handleCardClick(entry)}
				>
				  <div className="h-20 w-20 sm:h-24 sm:w-24 overflow-hidden flex-shrink-0">
					<img
					  src={SMALL_IMG_BASE_URL + entry.image}
					  alt={entry.title}
					  className="h-full w-full object-cover"
					/>
				  </div>
				  
				  <div className="flex-grow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
					<div>
					  <h3 className="font-medium text-lg">{entry.title}</h3>
					  <div className="flex items-center gap-2 text-gray-400 text-sm">
						<Calendar size={14} />
						<span>{formatDate(entry.createdAt)}</span>
					  </div>
					</div>
					
					<div className="flex items-center gap-3">
					  <span
						className={`py-1 px-3 rounded-full text-xs font-medium flex items-center gap-1 ${
						  entry.searchType === "movie"
							? "bg-red-600"
							: "bg-blue-600"
						}`}
					  >
						{entry.searchType === "movie" ? (
						  <>
							<Film size={12} />
							<span>Movie</span>
						  </>
						) : (
						  <>
							<Tv size={12} />
							<span>TV Show</span>
						  </>
						)}
					  </span>
					  
					  <button 
						className={`p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors ${isDeleteMode ? "bg-red-600 text-white" : "text-gray-400"}`}
						onClick={(e) => handleDelete(entry, e)}
					  >
						<Trash size={16} />
					  </button>
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
  
  export default SearchHistoryPage;
  