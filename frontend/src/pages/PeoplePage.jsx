// src/pages/PeoplePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PeopleSlider from "../components/PeopleSlider";
import { Search, TrendingUp, Award, Film, Star, Clapperboard } from "lucide-react";
import axios from "axios";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants.js";

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredPerson, setFeaturedPerson] = useState(null);
  const [ setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch a featured person for the hero section
  useEffect(() => {
    const fetchFeaturedPerson = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/v1/people/featured");
        setFeaturedPerson(response.data);
      } catch (error) {
        console.error("Failed to fetch featured person:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPerson();
  }, []);

  // Categories for the filter tabs
  const categories = [
    { id: "all", name: "All", icon: <Star size={18} /> },
    { id: "trending", name: "Trending", icon: <TrendingUp size={18} /> },
    { id: "actors", name: "Actors", icon: <Film size={18} /> },
    { id: "directors", name: "Directors", icon: <Clapperboard size={18} /> },
    { id: "award-winners", name: "Award Winners", icon: <Award size={18} /> }
  ];

  // Handler for search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/search?type=person&query=${encodeURIComponent(searchQuery.trim())}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section with Featured Person */}
      <div className="relative bg-gray-900 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/10 z-10"></div>

        {/* Background image */}
        {featuredPerson && featuredPerson.profile_path && (
          <div className="absolute inset-0 opacity-30">
            <img
              src={`${ORIGINAL_IMG_BASE_URL}${featuredPerson.profile_path}`}
              alt=""
              className="w-full h-full object-cover object-center blur-sm"
            />
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6 pt-20 pb-16 md:py-28 relative z-20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Featured person image */}
            {featuredPerson ? (
              <div className="w-48 md:w-64 lg:w-80 shrink-0">
                <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-red-900/20 border-2 border-red-600/10">
                  <img
                    src={featuredPerson.profile_path
                      ? `${ORIGINAL_IMG_BASE_URL}${featuredPerson.profile_path}`
                      : "/images/person-placeholder.png"
                    }
                    alt={featuredPerson.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="w-48 md:w-64 lg:w-80 shrink-0">
                <div className="aspect-[2/3] rounded-xl bg-gray-800 animate-pulse"></div>
              </div>
            )}

            {/* Hero content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Discover Stars
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-8">
                Explore the lives and careers of your favorite actors, directors, and industry talents.
              </p>

              {/* Search form */}
              <form onSubmit={handleSearch} className="max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for actors, directors, and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-3 px-5 pr-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </form>

              {/* Featured person info (if available) */}
              {featuredPerson && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-red-500 mb-1">Featured Artist</h2>
                  <Link
                    to={`/people/${featuredPerson.id}`}
                    className="text-2xl font-bold hover:text-red-400 transition"
                  >
                    {featuredPerson.name}
                  </Link>
                  {featuredPerson.known_for_department && (
                    <p className="text-gray-400 mt-1">
                      {featuredPerson.known_for_department}
                    </p>
                  )}
                  {featuredPerson.known_for && featuredPerson.known_for.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-400">Known for</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {featuredPerson.known_for.slice(0, 3).map(work => (
                          <Link
                            key={work.id}
                            to={`/watch/${work.id}`}
                            className="inline-block px-3 py-1 bg-gray-800/60 rounded-full text-sm hover:bg-red-900/60 transition"
                          >
                            {work.title || work.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 bg-black/80 backdrop-blur-md z-30 border-y border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex overflow-x-auto gap-1 md:gap-2 no-scrollbar">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2 transition-all ${selectedCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-300'
                  }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col gap-16">
          {/* Conditionally show sections based on selected category */}
          {(selectedCategory === "all" || selectedCategory === "trending") && (
            <PeopleSlider
              category="trending"
              title="Trending People"
              subtitle="Popular personalities making headlines this week"
              enhancedDesign={true}
            />
          )}

          {(selectedCategory === "all" || selectedCategory === "actors") && (
            <PeopleSlider
              category="actors"
              title="Popular Actors"
              subtitle="Fan favorites from the big and small screens"
              enhancedDesign={true}
            />
          )}

          {(selectedCategory === "all" || selectedCategory === "directors") && (
            <PeopleSlider
              category="directors"
              title="Acclaimed Directors"
              subtitle="Visionaries behind your favorite films"
              enhancedDesign={true}
            />
          )}

          {(selectedCategory === "all" || selectedCategory === "award-winners") && (
            <PeopleSlider
              category="award_winners"
              title="Award Winners"
              subtitle="Actors and filmmakers recognized for excellence"
              enhancedDesign={true}
            />
          )}
        </div>
      </div>

      {/* Profile Highlights Section */}
      <div className="bg-gradient-to-b from-black to-gray-900 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Explore Entertainment Professionals</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Actors Card */}
            <div className="bg-gray-800/60 rounded-xl overflow-hidden group">
              <div className="h-40 bg-gradient-to-r from-blue-900 to-purple-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
                  <img src="/public/actors-banner.jpg" alt="Actors" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film size={48} className="text-white/70" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Actors & Actresses</h3>
                <p className="text-gray-400 mb-4">Discover performers who bring characters to life on screen</p>
                <Link
                  to="/search?type=person&query=actor&department=acting"
                  className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition"
                >
                  Browse Actors
                </Link>

              </div>
            </div>

            {/* Directors Card */}
            <div className="bg-gray-800/60 rounded-xl overflow-hidden group">
              <div className="h-40 bg-gradient-to-r from-red-900 to-amber-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
                  <img src="/public/directors-banner.jpg" alt="Directors" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clapperboard size={48} className="text-white/70" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Directors</h3>
                <p className="text-gray-400 mb-4">Explore the creative minds behind your favorite films</p>
                <Link
                  to="/search?type=person&query=director&department=directing"
                  className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition"
                >
                  Browse Directors
                </Link>

              </div>
            </div>

            {/* Writers Card */}
            <div className="bg-gray-800/60 rounded-xl overflow-hidden group">
              <div className="h-40 bg-gradient-to-r from-emerald-900 to-teal-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
                  <img src="/public/writers-banner.jpg" alt="Writers" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                    <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M10.3 15.7a2 2 0 1 0-3-2.6"></path>
                    <path d="M15 11v4.7a2 2 0 1 1-4 0V11"></path>
                    <path d="M9 12v5.3a2 2 0 0 1-2 2 2 2 0 0 1-2-2V12"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Writers</h3>
                <p className="text-gray-400 mb-4">Discover the storytellers behind the scripts and screenplays</p>
                <Link
                  to="/search?type=person&query=writer&department=writing"
                  className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition"
                >
                  Browse Writers
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for hiding scrollbars while allowing scrolling */}
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}