// src/pages/PeoplePage.jsx
import Navbar from "../components/Navbar";
import PeopleSlider from "../components/PeopleSlider";

export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/people-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <div className="container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Stars
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
              Explore popular actors, directors, and other talents in entertainment
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col gap-16">
          {/* Trending People */}
          <PeopleSlider
            category="trending"
            title="Trending People"
            subtitle="Popular personalities making headlines this week"
          />

          {/* Popular People */}
          <PeopleSlider
            category="popular"
            title="Popular People"
            subtitle="Fan favorites from movies and TV shows"
          />
        </div>
      </div>
    </div>
  );
}
