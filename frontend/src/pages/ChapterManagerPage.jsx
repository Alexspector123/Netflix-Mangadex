import React from "react";

const mangaList = [
  {
    id: "1",
    title: "One Piece",
    cover: "https://upload.wikimedia.org/wikipedia/en/2/2c/OnePiece62Cover.png",
    chapterCount: 1090,
    lastUpdated: "2025-05-20",
  },
  {
    id: "2",
    title: "Attack on Titan",
    cover: "https://upload.wikimedia.org/wikipedia/en/8/8b/Attack_on_Titan_cover.jpg",
    chapterCount: 139,
    lastUpdated: "2025-04-01",
  },
];

const ChapterManagerPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Chapter Manager</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mangaList.map((manga) => (
            <div
              key={manga.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition p-4 flex flex-col"
            >
              <img
                src={manga.cover}
                alt={manga.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {manga.title}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                Chapters: <span className="font-medium">{manga.chapterCount}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Last Updated: {manga.lastUpdated}
              </p>
              <div className="mt-auto flex gap-2">
                <button className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Add Chapter
                </button>
                <button className="flex-1 px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterManagerPage;