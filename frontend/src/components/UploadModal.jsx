import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadModal = ({ readModalRef, onClose }) => {

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
        description: '',
        authorName: '',
        artistName: '',
        country: '',
        status: '',
        yearCreated: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleReset = () => {
        setFormData({
            title: '',
            description: '',
            authorName: '',
            artistName: '',
            country: '',
            status: '',
            yearCreated: ''
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onClose();
            handleReset();
        }, 1500);
    };

    return (
        <AnimatePresence>
            <motion.div 
                ref={readModalRef} 
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
                            <h2 className="text-[#E50914] text-2xl font-bold">Upload Content</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer !rounded-button whitespace-nowrap"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="h-px bg-gray-700 mb-6"></div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
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
                                <div className="relative">
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full bg-[#333333] text-[#E5E5E5] px-4 py-3 rounded border-none focus:ring-2 focus:ring-[#E50914] outline-none transition-all text-sm resize-none"
                                        placeholder="Description"
                                    ></textarea>
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
                                                <option value="ongoing">Ongoing</option>
                                                <option value="complete">Complete</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="hiatus">Hiatus</option>
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
                                            placeholder="Year Created (YYYY-MM-DD)"
                                            pattern="[0-9]{4}"
                                            maxLength={4}
                                        />
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
                                    {isLoading ? 'Uploading...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UploadModal;
