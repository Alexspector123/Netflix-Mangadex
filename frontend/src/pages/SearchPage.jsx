import { useState, useEffect, useRef } from "react";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SearchPage = () => {
	const [activeTab, setActiveTab] = useState("movie");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const { setContentType } = useContentStore();
  const navigate = useNavigate();

  const debounceRef = useRef(null);

  // Khi thay đổi tab, xóa kết quả cũ và cập nhật loại content
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setContentType(tab === "movie" ? "movie" : tab === "tv" ? "tv" : "person");
    setResults([]);
    setSearchTerm("");
    navigate(`/search?query=`, { replace: true });
  };

  // Debounce tìm kiếm mỗi khi searchTerm hoặc activeTab thay đổi
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/v1/search/${activeTab}/${encodeURIComponent(searchTerm)}`);
        setResults(res.data.content);
        navigate(`/search?query=${encodeURIComponent(searchTerm)}`, { replace: true });
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("Nothing found, make sure you are searching under the right category");
        } else {
          toast.error("An error occurred, please try again later");
        }
        setResults([]);
      }
    }, 50);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, activeTab, navigate]);

  return (
    <div className='bg-black min-h-screen text-white'>
      <Navbar />
      <div className='container mx-auto px-4 py-20'>
        {/* Tab chọn loại nội dung */}
        <div className='flex justify-center gap-3 mb-4'>
          {["movie", "tv", "person"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 rounded ${activeTab === tab ? "bg-red-600" : "bg-gray-800"} hover:bg-red-700`}
              onClick={() => handleTabClick(tab)}
            >
              {tab === "movie"
                ? "Movies"
                : tab === "tv"
                ? "TV Shows"
                : "Person"}
            </button>
          ))}
        </div>

        {/* Input tìm kiếm */}
        <div className='flex gap-2 items-stretch mb-8 max-w-2xl mx-auto'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search for a ${activeTab}`}
            className='w-full p-2 rounded bg-gray-800 text-white'
          />
          <button
            className='bg-red-600 hover:bg-red-700 text-white p-2 rounded'
            onClick={() => setSearchTerm(searchTerm.trim())}
          >
            <Search className='size-6' />
          </button>
        </div>

        {/* Kết quả tìm kiếm */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {results.map((result) => {
            if (!result.poster_path && !result.profile_path) return null;
            return (
              <div key={result.id} className='bg-gray-800 p-4 rounded'>
                {activeTab === "person" ? (
                  <div className='flex flex-col items-center'>
                    <img
                      src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                      alt={result.name}
                      className='max-h-96 rounded mx-auto'
                    />
                    <h2 className='mt-2 text-xl font-bold'>{result.name}</h2>
                  </div>
                ) : (
                  <Link
                    to={`/watch/${result.id}`}
                    onClick={() => setContentType(activeTab)}
                  >
                    <img
                      src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                      alt={result.title || result.name}
                      className='w-full h-auto rounded'
                    />
                    <h2 className='mt-2 text-xl font-bold'>{result.title || result.name}</h2>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default SearchPage;