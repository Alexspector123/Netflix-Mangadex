import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PeopleSlider = ({ category, title, subtitle }) => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArrows, setShowArrows] = useState(false);
  const sliderRef = useRef(null);
  
  const SMALL_IMG_BASE_URL = "https://image.tmdb.org/t/p/w200";
  const placeholderImage = "/pf.jpg";

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/v1/people/${category}`, { 
          withCredentials: true 
        });
        setPeople(res.data.content || []);
      } catch (err) {
        console.error(`Error fetching ${category} people:`, err);
        setError(`Failed to load ${category} people`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPeople();
  }, [category]);

  const scroll = (delta) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  // Calculate if we can scroll more
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollability);
      // Initial check
      checkScrollability();
      
      // Re-check when content might have changed
      if (people.length > 0) {
        checkScrollability();
      }
      
      return () => {
        slider.removeEventListener('scroll', checkScrollability);
      };
    }
  }, [people]);

  if (loading) {
    return (
      <div className="px-5 md:px-8">
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        {subtitle && <p className="text-gray-400 mb-4">{subtitle}</p>}
        <div className="flex space-x-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="min-w-[200px] animate-pulse">
              <div className="bg-gray-700 rounded-lg h-72 w-48"></div>
              <div className="bg-gray-700 h-4 w-32 mx-auto mt-3 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-5 md:px-8">
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        {subtitle && <p className="text-gray-400 mb-4">{subtitle}</p>}
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
          <p>{error}</p>
          <button 
            className="mt-2 px-4 py-1 bg-red-700 rounded hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (people.length === 0) {
    return null;
  }

  return (
    <div
      className="relative px-5 md:px-8"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        {subtitle && <p className="text-gray-400">{subtitle}</p>}
      </div>

      <div className="relative">
        <div
          className="flex space-x-4 overflow-x-scroll scrollbar-hide py-2"
          ref={sliderRef}
        >
          {people.map((person) => (
            <Link
              to={`/people/${person.id}`}
              key={person.id}
              className="min-w-[180px] group flex-shrink-0"
            >
              <div className="rounded-lg overflow-hidden bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="h-[270px] w-[180px] bg-gray-700">
  <img
    src={person.profile_path ? `${SMALL_IMG_BASE_URL}${person.profile_path}` : placeholderImage}
    alt={person.name}
    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
    loading="lazy"
    onError={(e) => { e.target.src = placeholderImage }}
  />
</div>

                <div className="p-3">
                  <p className="font-medium text-center truncate">{person.name}</p>
                  {person.known_for_department && (
                    <p className="text-sm text-gray-400 text-center truncate">{person.known_for_department}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Arrows */}
        {(showArrows || window.innerWidth < 768) && (
          <>
            <button
              onClick={() => scroll(-sliderRef.current.offsetWidth * 0.75)}
              className={`absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full 
                         hover:bg-black/80 transition-opacity ${!canScrollLeft ? 'opacity-0' : 'opacity-100'}`}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll(sliderRef.current.offsetWidth * 0.75)}
              className={`absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 p-2 rounded-full 
                         hover:bg-black/80 transition-opacity ${!canScrollRight ? 'opacity-0' : 'opacity-100'}`}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PeopleSlider;