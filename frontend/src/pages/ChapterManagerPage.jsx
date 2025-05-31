import React, { useState, useRef, useEffect } from "react";
import useLatestChapList from "../hooks/manga/useLatestChapList.jsx";
import UploadChapterModal from "../components/modals/UploadChapterModal.jsx";
import { useNavigate } from "react-router-dom";

const ChapterManagerPage = () => {
  const { mangaList, isLoading, error } = useLatestChapList();
    const [showUploadChapterModal, setShowUploadChapterModal] = useState(false);
  console.log(mangaList);
  const navigate = useNavigate();

    // For upload manga modal
    const uploadChapterModalRef = useRef();
    useEffect(() => {
      const handleClickOutsideDesktop = (e) => {
        if (uploadChapterModalRef.current && uploadChapterModalRef.current.contains(e.target)) {
          setShowUploadChapterModal(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutsideDesktop);
      return () => {
        document.removeEventListener("mousedown", handleClickOutsideDesktop);
      };
    }, []);

  if (isLoading) return <p className="text-white text-center mt-20">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-[#141414] p-8">
      			{showUploadChapterModal && <UploadChapterModal uploadChapterModalRef={uploadChapterModalRef} onClose={() => setShowUploadChapterModal(false)} title={mangaList.title} />}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-red-600 drop-shadow-lg">
          Chapter Manager
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {mangaList.map((manga) => (
            <div
              key={manga.id}
              className="bg-[#222] rounded-lg shadow-lg hover:shadow-red-700 transition-shadow duration-300 flex flex-col"
            >
              <img
                src={manga.cover}
                alt={manga.title}
                className="w-full h-56 object-cover rounded-t-lg"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-white mb-2 truncate">{manga.title}</h2>
                <p className="text-sm text-gray-300 mb-1">
                  Latest chapters: <span className="font-semibold text-red-500">{manga.latestChapNo}</span>
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Last Updated: <span>{manga.lastUpdated.slice(0, 10)}</span>
                </p>
                <div className="mt-auto flex gap-3">
                  <button
                    onClick={() => setShowUploadChapterModal(true)}
                    className="flex-1 px-4 py-2 bg-red-600 rounded hover:bg-red-700 text-white font-semibold text-sm transition"
                  >
                    Add Chapter
                  </button>
                  <button
                    onClick={() => navigate(`/manage/${manga.id}/${manga.chapter_id}`)}
                    className="flex-1 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-gray-300 font-semibold text-sm transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterManagerPage;
