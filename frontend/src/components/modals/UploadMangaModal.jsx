import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadMangaModal = ({ uploadMangaModalRef, onClose }) => {

    const countries = [
        'United States',
        'United Kingdom',
        'Canada',
        'Australia',
        'France',
        'Germany',
        'Japan',
        'China',
        'South Korea',
        'Brazil'
    ];
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        authorName: '',
        artistName: '',
        country: '',
        status: '',
        yearCreated: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreviewUrl(file ? URL.createObjectURL(file) : "");
        // Reset the input value so the same file can be selected again after reset
        if (e.target) e.target.value = null;
    };

    const handleReset = () => {
        setFormData({
            title: '',
            authorName: '',
            artistName: '',
            country: '',
            status: '',
            yearCreated: ''
        });
        setImage(null);
        setPreviewUrl("");
        
        const fileInput = document.getElementById("manga-image-upload");
        if (fileInput) fileInput.value = null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("title", formData.title);
        data.append("authorName", formData.authorName);
        data.append("artistName", formData.artistName);
        data.append("country", formData.country);
        data.append("status", formData.status);
        data.append("yearCreated", formData.yearCreated);
        if (image) data.append("image", image);

        setIsLoading(true);
        try {
            const response = await fetch("/api/v2/manga/upload", {
                method: "POST",
                body: data,
            });
            if (response.ok) {
                // Optionally show a success message
                alert("Manga uploaded successfully!");
                onClose();
                handleReset();
            } else {
                // Optionally show an error message
                const error = await response.json();
                alert(error.message || "Upload failed");
            }
        } catch (err) {
            alert("Network error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={uploadMangaModalRef}
                className="sm:fixed sm:inset-0 sm:bg-black/50 sm:backdrop-blur-sm sm:z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
            </motion.div>

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
                            <h2 className="text-[#E50914] text-2xl font-bold">Upload Manga</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer !rounded-button whitespace-nowrap"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="h-px bg-gray-700 mb-6"></div>
                        <form onSubmit={handleSubmit}>
                          <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/3 w-full flex flex-col items-center justify-start">
                              <label
                                htmlFor="manga-image-upload"
                                className={`flex flex-col items-center justify-center 
                                            w-full h-full 
                                            bg-[#222] 
                                            ${previewUrl ? '' : 'border-2 border-dashed border-[#E50914]'} 
                                            rounded 
                                            cursor-pointer 
                                            hover:bg-[#333] 
                                            transition-colors group`}
                              >
                                {previewUrl ? (
                                  <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="object-contain max-h-full max-w-full rounded shadow"
                                  />
                                ) : (
                                  <>
                                    <i className="fas fa-cloud-upload-alt text-3xl text-[#E50914] mb-2 group-hover:scale-110 transition-transform"></i>
                                    <span className="text-[#E5E5E5] text-sm">Upload file</span>
                                  </>
                                )}
                                <input
                                  id="manga-image-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageChange}
                                />
                              </label>
                              {image && (
                                <button
                                  type="button"
                                  className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1 text-white hover:bg-opacity-90 transition"
                                  onClick={() => {
                                    setImage(null);
                                    setPreviewUrl("");
                                    const fileInput = document.getElementById("manga-image-upload");
                                    if (fileInput) fileInput.value = null;
                                  }}
                                  aria-label="Remove image"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              )}
                            </div>

                            <div className="md:w-2/3 w-full space-y-6">
                              <div className="relative">
                                <input
                                  type="text"
                                  id="title"
                                  name="title"
                                  value={formData.title}
                                  onChange={handleInputChange}
                                  className="w-full bg-[#333333] text-[#E5E5E5] px-4 py-3 rounded border-none focus:ring-2 focus:ring-[#E50914] outline-none transition-all text-sm"
                                  placeholder="Title"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                  <input
                                    type="text"
                                    id="authorName"
                                    name="authorName"
                                    value={formData.authorName}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#333333] text-[#E5E5E5] px-4 py-3 rounded border-none focus:ring-2 focus:ring-[#E50914] outline-none transition-all text-sm"
                                    placeholder="Author Name"
                                  />
                                </div>
                                <div className="relative">
                                  <input
                                    type="text"
                                    id="artistName"
                                    name="artistName"
                                    value={formData.artistName}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#333333] text-[#E5E5E5] px-4 py-3 rounded border-none focus:ring-2 focus:ring-[#E50914] outline-none transition-all text-sm"
                                    placeholder="Artist Name"
                                  />
                                </div>
                                <div className="relative">
                                  <div className="relative">
                                    <select
                                      id="country"
                                      name="country"
                                      value={formData.country}
                                      onChange={handleInputChange}
                                      className="w-full bg-[#333333] text-[#E5E5E5] px-4 py-3 rounded border-none focus:ring-2 focus:ring-[#E50914] outline-none transition-all text-sm appearance-none cursor-pointer"
                                    >
                                      <option value="" disabled>Select Country</option>
                                      <option value="custom">Add Custom Country</option>
                                      {countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                      ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                      <i className="fas fa-chevron-down"></i>
                                    </div>
                                    {formData.country === 'custom' && (
                                      <input
                                        type="text"
                                        id="customCountry"
                                        name="country"
                                        onChange={handleInputChange}
                                        className="w-full bg-[#333333] text-[#E5E5E5] px-4 py-3 rounded border-none focus:ring-2 focus:ring-[#E50914] outline-none transition-all text-sm mt-2"
                                        placeholder="Enter custom country"
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="relative">
                                  <div className="relative">
                                    <select
                                      id="status"
                                      name="status"
                                      value={formData.status}
                                      onChange={handleInputChange}
                                      className="w-full bg-[#333333] text-[#E5E5E5] px-4 py-3 rounded border-none focus:ring-2 focus:ring-[#E50914] outline-none transition-all text-sm appearance-none cursor-pointer"
                                    >
                                      <option value="" disabled>Select Status</option>
                                      <option value="ongoing">ongoing</option>
                                      <option value="completed">completed</option>
                                      <option value="cancelled">cancelled</option>
                                      <option value="hiatus">hiatus</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                      <i className="fas fa-chevron-down"></i>
                                    </div>
                                  </div>
                                </div>
                                <div className="relative">
                                  <input
                                    type="text"
                                    id="yearCreated"
                                    name="yearCreated"
                                    value={formData.yearCreated}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#333333] text-[#E5E5E5] px-4 py-3 rounded border-none focus:ring-2 focus:ring-[#E50914] outline-none transition-all text-sm"
                                    placeholder="Year Created"
                                    pattern="[0-9]{4}"
                                    maxLength={4}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3 justify-end mt-8">
                            <button
                              type="button"
                              onClick={onClose}
                              className="px-5 py-2 text-[#E5E5E5] bg-transparent border border-gray-600 rounded hover:bg-gray-800 transition-colors cursor-pointer !rounded-button whitespace-nowrap"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleReset}
                              className="px-5 py-2 text-[#E5E5E5] bg-[#333333] rounded hover:bg-[#444444] transition-colors cursor-pointer !rounded-button whitespace-nowrap"
                            >
                              Reset
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 text-white bg-[#E50914] rounded hover:bg-opacity-90 transition-colors flex items-center justify-center min-w-[100px] cursor-pointer !rounded-button whitespace-nowrap"
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

export default UploadMangaModal;
