import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const UploadChapterModal = ({ uploadChapterModalRef, onClose, title }) => {
  const fileInputRef = useRef(null);
  const [mangaTitle, setMangaTitle] = useState(title);
  const [chapterNumber, setChapterNumber] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [images, setImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newImages = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  
  const handleReset = () => {
    setMangaTitle("");
    setChapterNumber("");
    setChapterTitle("");
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!chapterNumber) {
      alert("Please input chapter number");
      return;
    }

    if (images.length === 0) {
      alert("Please upload chapter");
      return;
    }

    const formData = new FormData();
    formData.append("manga_title", mangaTitle);
    formData.append("chapter_number", chapterNumber);
    formData.append("chapter_title", chapterTitle);

    images.forEach((img) => {
      formData.append("pages", img.file);
    });

    try {
      const res = await axios.post("/api/v2/chapter/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(`✅ Upload success ${res.data.pages_uploaded} page!`);
      onClose();
      handleReset();
    } catch (err) {
      console.error(err);
      alert("❌ Upload fail");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={uploadChapterModalRef}
        className="sm:fixed sm:inset-0 sm:bg-black/50 sm:backdrop-blur-sm sm:z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-[#141414] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[#E50914] text-2xl font-bold">Upload Chapter</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpload}>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image upload */}
                <div className="md:w-1/2 w-full flex flex-col items-center">
                  <label
                    htmlFor="chapter-image-upload"
                    className={`flex flex-col items-center justify-center w-full min-h-[220px] bg-[#222] ${images.length === 0 ? "border-2 border-dashed border-[#E50914]" : ""} rounded cursor-pointer hover:bg-[#333] transition-colors group`}
                  >
                    {images.length > 0 ? (
                      <div className="w-full grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-2">
                        {images.map((img, idx) => (
                          <div 
                                key={idx}
                                className="relative group">
                            <img
                              src={img.preview}
                              alt={`preview-${idx}`}
                              className="rounded-md object-cover h-28 w-full border border-gray-700"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(idx);
                              }}
                              className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-75"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt text-4xl text-[#E50914] mb-2" />
                        <span className="text-[#E5E5E5] text-base">Upload files</span>
                      </>
                    )}
                    <input
                      id="chapter-image-upload"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  {images.length > 0 && (
                    <button
                      type="button"
                      className="mt-3 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      onClick={handleReset}
                    >
                      Remove All Images
                    </button>
                  )}
                </div>

                {/* Form Fields */}
                <div className="md:w-2/3 w-full space-y-6">
                  <input
                    type="text"
                    name="chapterNumber"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                    placeholder="Chapter Number"
                    className="w-full bg-[#333333] text-[#E5E5E5] px-4 py-3 rounded outline-none focus:ring-2 focus:ring-[#E50914] text-sm"
                    required
                  />
                  <input
                    type="text"
                    name="chapterTitle"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    placeholder="Chapter Title (optional)"
                    className="w-full bg-[#333333] text-[#E5E5E5] px-4 py-3 rounded outline-none focus:ring-2 focus:ring-[#E50914] text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-end mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-[#E5E5E5] bg-transparent border border-gray-600 rounded hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E50914] text-white rounded hover:bg-red-700 transition"
                >
                  {isLoading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadChapterModal;
