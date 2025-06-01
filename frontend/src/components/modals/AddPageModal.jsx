import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const AddPageModal = ({ isOpen, onClose, onAddPages }) => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);

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
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleAdd = () => {
    if (images.length === 0) {
      toast.success("Please select at least one image");
      return;
    }
    onAddPages(images.map((img) => img.file));
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="bg-[#141414] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#E50914] text-2xl font-bold">Add Pages</h2>
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <label
            htmlFor="page-upload"
            className={`flex flex-col items-center justify-center w-full min-h-[220px] bg-[#222] border-2 border-dashed border-[#E50914] rounded cursor-pointer hover:bg-[#333] transition-colors group mb-4`}
          >
            {images.length > 0 ? (
              <div className="w-full grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
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
                <span className="text-[#E5E5E5] text-base">Click to upload images</span>
              </>
            )}
            <input
              id="page-upload"
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
              onClick={handleReset}
              className="mb-4 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Remove All Images
            </button>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="px-5 py-2 text-[#E5E5E5] bg-transparent border border-gray-600 rounded hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-5 py-2 bg-[#E50914] text-white rounded hover:bg-red-700 transition"
            >
              Add Pages
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddPageModal;
