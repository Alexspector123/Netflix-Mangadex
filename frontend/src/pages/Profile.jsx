import { useState, useEffect } from "react";
import {
    User,
    Settings,
    Edit3,
    Clock,
    Heart,
    Shield,
    CreditCard,
    Gift,
    LogOut,
    Film,
    Bell,
    CheckCircle,
    ChevronRight,
    Camera,
    House
} from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { Link } from "react-router-dom";

const Profile = () => {
    const { user, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || "John Doe",
        email: user?.email || "john.doe@example.com",
        phone: user?.phone || "+1 (555) 123-4567",
        plan: user?.plan || "Premium",
        language: user?.language || "English",
        maturityRating: user?.maturityRating || "All Maturity Levels",
        autoplay: user?.autoplay !== undefined ? user.autoplay : true,
        nextEpisode: user?.nextEpisode !== undefined ? user.nextEpisode : true
    });

    // Mock viewing history data
    const viewingHistory = [
        { id: 1, title: "Stranger Things", season: "4", episode: "9", watchedDate: "Yesterday", image: "/images/stranger-things.jpg", progress: 100 },
        { id: 2, title: "The Witcher", season: "2", episode: "3", watchedDate: "3 days ago", image: "/images/witcher.jpg", progress: 67 },
        { id: 3, title: "Squid Game", season: "1", episode: "5", watchedDate: "Last week", image: "/images/squid-game.jpg", progress: 55 },
        { id: 4, title: "Money Heist", season: "5", episode: "2", watchedDate: "2 weeks ago", image: "/images/money-heist.jpg", progress: 23 }
    ];

    // Mock favorites data
    const favorites = [
        { id: 1, title: "Breaking Bad", type: "TV Show", addedDate: "3 months ago", image: "/images/breaking-bad.jpg" },
        { id: 2, title: "Inception", type: "Movie", addedDate: "5 months ago", image: "/images/inception.jpg" },
        { id: 3, title: "The Queen's Gambit", type: "TV Show", addedDate: "1 month ago", image: "/images/queens-gambit.jpg" }
    ];

    // Mock subscription data
    const subscriptionDetails = {
        plan: "Premium",
        billing: "$19.99/month",
        nextBillingDate: "May 15, 2025",
        paymentMethod: "Visa ending in 4242"
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileData({
            ...profileData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSaveProfile = () => {
        // In a real application, you would save the data to your backend here
        setIsEditing(false);
        // You could also update the user in your auth store
        // updateUser(profileData);
        console.log("Profile saved:", profileData);
    };

    return (
        <div className="max-h-screen max-w-screen">
            <div className="bg-black bg-opacity-70 shadow-lg overflow-hidden">

                {/* Profile Header */}
                <div className="relative h-40 bg-gradient-to-r from-red-900 to-red-600">
                    <div className="absolute -bottom-16 left-8 flex items-end">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-black bg-gray-800">
                                <img
                                    src={user?.image || "https://i.pravatar.cc/300"}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors">
                                <Camera size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="absolute bottom-4 right-6 flex space-x-2">
                        <button
                            className="px-4 py-2 bg-black-800 bg-opacity-50 hover:bg-opacity-70 rounded-md flex items-center gap-2 transition-colors"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Edit3 size={16} />
                            <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                        </button>
                        {isEditing && (
                            <button
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-2 transition-colors"
                                onClick={handleSaveProfile}
                            >
                                <CheckCircle size={16} />
                                <span>Save Changes</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Navigation */}
                <div className="flex flex-wrap border-b border-gray-800 pt-20 px-8">
                    <button
                        className={`flex items-center gap-2 px-5 py-4 font-medium text-sm transition-colors ${activeTab === "profile" ? "border-b-2 border-red-600 text-red-600" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        <User size={18} />
                        <span>Profile</span>
                    </button>
                    <button
                        className={`flex items-center gap-2 px-5 py-4 font-medium text-sm transition-colors ${activeTab === "history" ? "border-b-2 border-red-600 text-red-600" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveTab("history")}
                    >
                        <Clock size={18} />
                        <span>Viewing History</span>
                    </button>
                    <button
                        className={`flex items-center gap-2 px-5 py-4 font-medium text-sm transition-colors ${activeTab === "favorites" ? "border-b-2 border-red-600 text-red-600" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveTab("favorites")}
                    >
                        <Heart size={18} />
                        <span>My List</span>
                    </button>
                    <button
                        className={`flex items-center gap-2 px-5 py-4 font-medium text-sm transition-colors ${activeTab === "subscription" ? "border-b-2 border-red-600 text-red-600" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveTab("subscription")}
                    >
                        <CreditCard size={18} />
                        <span>Subscription</span>
                    </button>
                    <button
                        className={`flex items-center gap-2 px-5 py-4 font-medium text-sm transition-colors ${activeTab === "settings" ? "border-b-2 border-red-600 text-red-600" : "text-gray-400 hover:text-white"}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>
                    <Link
                        to="/"
                        className={`flex items-center gap-2 px-5 py-4 font-medium text-sm transition-colors ${activeTab === "home" ? "border-b-2 border-red-600 text-red-600" : "text-gray-400 hover:text-white"}`}
                        onClick={() => {
                            setActiveTab("home");
                            setContentType("movie");
                        }}
                    >
                        <House size={18} />
                        <span>Home</span>
                    </Link>
                </div>

                {/* Content Sections */}
                <div className="p-8">
                    {/* Profile Section */}
                    {activeTab === "profile" && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        ) : (
                                            <p className="text-lg">{profileData.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        ) : (
                                            <p className="text-lg">{profileData.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            />
                                        ) : (
                                            <p className="text-lg">{profileData.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="plan" className="block text-sm font-medium text-gray-400 mb-1">Current Plan</label>
                                        <div className="flex items-center justify-between bg-gray-800 rounded-md p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-600 rounded-full">
                                                    <Film size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{profileData.plan}</p>
                                                    <p className="text-sm text-gray-400">4K + HDR</p>
                                                </div>
                                            </div>
                                            <button className="text-sm text-red-500 hover:text-red-400">Change</button>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="language" className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                                        {isEditing ? (
                                            <select
                                                id="language"
                                                name="language"
                                                value={profileData.language}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <option value="English">English</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="French">French</option>
                                                <option value="German">German</option>
                                                <option value="Japanese">Japanese</option>
                                            </select>
                                        ) : (
                                            <p className="text-lg">{profileData.language}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="maturityRating" className="block text-sm font-medium text-gray-400 mb-1">Maturity Rating</label>
                                        {isEditing ? (
                                            <select
                                                id="maturityRating"
                                                name="maturityRating"
                                                value={profileData.maturityRating}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <option value="All Maturity Levels">All Maturity Levels</option>
                                                <option value="Teen and Below">Teen and Below</option>
                                                <option value="Children Only">Children Only</option>
                                            </select>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Shield size={16} className="text-gray-400" />
                                                <p className="text-lg">{profileData.maturityRating}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Viewing History Section */}
                    {activeTab === "history" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Viewing History</h2>
                                <button className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1">
                                    <span>View All</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {viewingHistory.map(item => (
                                    <div key={item.id} className="flex items-center bg-gray-800 bg-opacity-40 rounded-lg overflow-hidden hover:bg-opacity-60 transition-colors">
                                        <div className="h-20 w-36 relative flex-shrink-0">
                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-grow px-4 py-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium">{item.title}</h3>
                                                    <p className="text-sm text-gray-400">S{item.season} E{item.episode}</p>
                                                </div>
                                                <p className="text-sm text-gray-400">{item.watchedDate}</p>
                                            </div>
                                            <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-600"
                                                    style={{ width: `${item.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Favorites Section */}
                    {activeTab === "favorites" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">My List</h2>
                                <button className="text-sm text-red-500 hover:text-red-400 flex items-center gap-1">
                                    <span>View All</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favorites.map(item => (
                                    <div key={item.id} className="bg-gray-800 bg-opacity-40 rounded-lg overflow-hidden hover:bg-opacity-60 transition-colors">
                                        <div className="h-40 relative">
                                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                                            <div className="absolute top-2 right-2">
                                                <button className="p-1 bg-black bg-opacity-70 rounded-full text-red-500 hover:text-white transition-colors">
                                                    <Heart size={16} fill="currentColor" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium">{item.title}</h3>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-sm text-gray-400">{item.type}</p>
                                                <p className="text-xs text-gray-500">Added {item.addedDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Subscription Section */}
                    {activeTab === "subscription" && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold mb-6">Subscription Details</h2>

                            <div className="bg-gray-800 bg-opacity-40 rounded-lg p-6">
                                <div className="flex flex-wrap justify-between">
                                    <div className="mb-6 md:mb-0">
                                        <p className="text-sm text-gray-400 mb-1">Current Plan</p>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-red-600 rounded-md">
                                                <Film size={16} />
                                            </div>
                                            <p className="font-medium text-lg">{subscriptionDetails.plan}</p>
                                        </div>
                                        <p className="text-gray-400 mt-1">{subscriptionDetails.billing}</p>
                                    </div>

                                    <div className="mb-6 md:mb-0">
                                        <p className="text-sm text-gray-400 mb-1">Next Billing Date</p>
                                        <p className="font-medium text-lg">{subscriptionDetails.nextBillingDate}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Payment Method</p>
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={18} />
                                            <p className="font-medium">{subscriptionDetails.paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 mt-6 pt-6 flex flex-wrap gap-4">
                                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                                        Change Plan
                                    </button>
                                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors flex items-center gap-2">
                                        <CreditCard size={16} />
                                        <span>Update Payment</span>
                                    </button>
                                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors flex items-center gap-2">
                                        <Gift size={16} />
                                        <span>Redeem Gift Card</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-800 bg-opacity-40 rounded-lg p-6">
                                <h3 className="text-lg font-medium mb-4">Billing History</h3>
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-gray-400 border-b border-gray-700">
                                            <th className="pb-2">Date</th>
                                            <th className="pb-2">Amount</th>
                                            <th className="pb-2">Status</th>
                                            <th className="pb-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-gray-700">
                                            <td className="py-3">March 15, 2025</td>
                                            <td>$19.99</td>
                                            <td className="text-green-500">Paid</td>
                                            <td className="text-right"><button className="text-sm text-gray-400 hover:text-white">Invoice</button></td>
                                        </tr>
                                        <tr className="border-b border-gray-700">
                                            <td className="py-3">February 15, 2025</td>
                                            <td>$19.99</td>
                                            <td className="text-green-500">Paid</td>
                                            <td className="text-right"><button className="text-sm text-gray-400 hover:text-white">Invoice</button></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3">January 15, 2025</td>
                                            <td>$19.99</td>
                                            <td className="text-green-500">Paid</td>
                                            <td className="text-right"><button className="text-sm text-gray-400 hover:text-white">Invoice</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Settings Section */}
                    {activeTab === "settings" && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

                            <div className="space-y-6">
                                <div className="bg-gray-800 bg-opacity-40 rounded-lg p-6">
                                    <h3 className="text-lg font-medium mb-4">Playback Settings</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Autoplay next episode</p>
                                                <p className="text-sm text-gray-400">Automatically play the next episode in a series</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    name="autoplay"
                                                    checked={profileData.autoplay}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                                <div className={`w-11 h-6 ${!isEditing ? "bg-gray-700" : "bg-gray-700 peer-checked:bg-red-600"} peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Autoplay previews</p>
                                                <p className="text-sm text-gray-400">Play previews while browsing</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    name="nextEpisode"
                                                    checked={profileData.nextEpisode}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                />
                                                <div className={`w-11 h-6 ${!isEditing ? "bg-gray-700" : "bg-gray-700 peer-checked:bg-red-600"} peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                                            </label>
                                        </div>

                                        <div className="pt-4 border-t border-gray-700">
                                            <p className="font-medium mb-2">Video Quality</p>
                                            <div className="flex flex-wrap gap-3">
                                                <button className={`px-3 py-1.5 rounded-full text-sm ${isEditing ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"}`}>Auto</button>
                                                <button className={`px-3 py-1.5 rounded-full text-sm ${isEditing ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-700 text-gray-300"}`}>Low</button>
                                                <button className={`px-3 py-1.5 rounded-full text-sm ${isEditing ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-700 text-gray-300"}`}>Medium</button>
                                                <button className={`px-3 py-1.5 rounded-full text-sm ${isEditing ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-700 text-gray-300"}`}>High</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800 bg-opacity-40 rounded-lg p-6">
                                    <h3 className="text-lg font-medium mb-4">Notification Settings</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Email Notifications</p>
                                                <p className="text-sm text-gray-400">Receive emails about new releases and recommendations</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked disabled={!isEditing} />
                                                <div className={`w-11 h-6 ${!isEditing ? "bg-gray-700" : "bg-gray-700 peer-checked:bg-red-600"} peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Push Notifications</p>
                                                <p className="text-sm text-gray-400">Get notified about new releases on your device</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" checked disabled={!isEditing} />
                                                <div className={`w-11 h-6 ${!isEditing ? "bg-gray-700" : "bg-gray-700 peer-checked:bg-red-600"} peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-md text-left flex items-center justify-between transition-colors">
                                        <span className="font-medium">Change Password</span>
                                        <ChevronRight size={18} />
                                    </button>

                                    <button className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-md text-left flex items-center justify-between transition-colors">
                                        <span className="font-medium">Parental Controls</span>
                                        <ChevronRight size={18} />
                                    </button>

                                    <button
                                        className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-md text-left flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
                                        onClick={logout}
                                    >
                                        <LogOut size={18} />
                                        <span className="font-medium">Sign Out of All Devices</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;