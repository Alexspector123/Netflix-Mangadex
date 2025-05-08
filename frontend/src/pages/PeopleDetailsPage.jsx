import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { 
  Calendar, 
  MapPin, 
  Star, 
  Film, 
  Tv, 
  Award, 
  ExternalLink, 
  ArrowLeft, 
  Instagram, 
  Twitter,
  Facebook
} from "lucide-react";

const PeopleDetails = () => {
    const { id: people_id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [socialMedia, setSocialMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
  const SMALL_IMG_BASE_URL = "https://image.tmdb.org/t/p/w200";
  const placeholderImage = "/pf.jpg";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch person details
        const detailsRes = await axios.get(`/api/v1/people/${people_id}/details`, { 
          withCredentials: true 
        });
        setPerson(detailsRes.data.content);
        
        // Fetch person credits (we'll need to add this endpoint to the backend)
        const creditsRes = await axios.get(`/api/v1/people/${people_id}/credits`, {
          withCredentials: true
        }).catch(() => ({ data: { content: { cast: [], crew: [] } } }));
        setCredits(creditsRes.data.content);
        
        // Fetch social media (we'll need to add this endpoint to the backend)
        const socialRes = await axios.get(`/api/v1/people/${people_id}/social`, {
          withCredentials: true
        }).catch(() => ({ data: { content: {} } }));
        setSocialMedia(socialRes.data.content);
        
      } catch (err) {
        console.error("Error fetching person data:", err);
        setError("Failed to load person details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [people_id]);

  // Calculate age function
  const calculateAge = (birthDate, deathDate = null) => {
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 pb-10">
          <div className="flex flex-col md:flex-row gap-8 animate-pulse">
            <div className="w-full md:w-1/3 bg-gray-800 rounded-lg h-96"></div>
            <div className="w-full md:w-2/3">
              <div className="h-10 bg-gray-800 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-800 rounded w-1/2 mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 pb-10">
          <div className="bg-red-900/30 border border-red-700 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="mb-4">{error || "Person not found"}</p>
            <Link to="/people" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
              <ArrowLeft size={18} /> Back to people
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format biography with paragraph breaks
  const formattedBio = person.biography?.split('\n\n').filter(p => p.trim()) || [];
  const bioPreview = formattedBio.length > 0 ? formattedBio[0] : '';
  const shouldTruncateBio = formattedBio.length > 1 || (bioPreview.length > 300);

  // Get known for credits
  const knownForCredits = credits?.cast
    ?.sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />
      
      {/* Back button */}
      <div className="container mx-auto px-4 pt-20">
        <Link to="/people" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} /> Back to People
        </Link>
      </div>
      
      {/* Hero section */}
      <div className="container mx-auto px-4 pb-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Image */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="sticky top-24">
              <div className="rounded-lg overflow-hidden shadow-lg border border-gray-800">
                <img
                  src={person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : placeholderImage}
                  alt={person.name}
                  className="w-full object-cover"
                  onError={(e) => { e.target.src = placeholderImage }}
                />
              </div>
              
              {/* Social Media Links */}
              {socialMedia && (
                <div className="flex gap-3 mt-4 justify-center">
                  {socialMedia.instagram_id && (
                    <a 
                      href={`https://instagram.com/${socialMedia.instagram_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-2 rounded-full hover:bg-pink-900 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {socialMedia.twitter_id && (
                    <a 
                      href={`https://twitter.com/${socialMedia.twitter_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-2 rounded-full hover:bg-blue-900 transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                  {socialMedia.facebook_id && (
                    <a 
                      href={`https://facebook.com/${socialMedia.facebook_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-2 rounded-full hover:bg-blue-800 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                  {person.homepage && (
                    <a 
                      href={person.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 p-2 rounded-full hover:bg-purple-900 transition-colors"
                      aria-label="Personal Website"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              )}
              
              {/* Personal Info */}
              <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4">Personal Info</h3>
                
                <div className="space-y-4">
                  {person.known_for_department && (
                    <div>
                      <h4 className="text-gray-400 text-sm">Known For</h4>
                      <p>{person.known_for_department}</p>
                    </div>
                  )}
                  
                  {person.birthday && (
                    <div>
                      <h4 className="text-gray-400 text-sm flex items-center gap-1">
                        <Calendar size={14} /> Born
                      </h4>
                      <p>
                        {new Date(person.birthday).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {person.place_of_birth && ` in ${person.place_of_birth}`}
                        {person.deathday ? '' : ` (${calculateAge(person.birthday)} years old)`}
                      </p>
                    </div>
                  )}
                  
                  {person.deathday && (
                    <div>
                      <h4 className="text-gray-400 text-sm">Died</h4>
                      <p>
                        {new Date(person.deathday).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {` (${calculateAge(person.birthday, person.deathday)} years old)`}
                      </p>
                    </div>
                  )}
                  
                  {person.place_of_birth && !person.birthday?.includes(person.place_of_birth) && (
                    <div>
                      <h4 className="text-gray-400 text-sm flex items-center gap-1">
                        <MapPin size={14} /> Birthplace
                      </h4>
                      <p>{person.place_of_birth}</p>
                    </div>
                  )}
                  
                  {person.gender && (
                    <div>
                      <h4 className="text-gray-400 text-sm">Gender</h4>
                      <p>{person.gender === 1 ? 'Female' : person.gender === 2 ? 'Male' : 'Other'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Details */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{person.name}</h1>
            
            {/* Popularity indicator */}
            {person.popularity > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <Star className="text-yellow-500" size={18} fill="currentColor" />
                <span>Popularity: {person.popularity.toFixed(1)}</span>
              </div>
            )}
            
            {/* Biography */}
            {formattedBio.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Biography</h2>
                <div className="prose prose-invert max-w-none">
                  {shouldTruncateBio && !showFullBio ? (
                    <>
                      <p>{bioPreview.length > 300 ? `${bioPreview.substring(0, 300)}...` : bioPreview}</p>
                      <button 
                        onClick={() => setShowFullBio(true)}
                        className="text-blue-400 hover:text-blue-300 mt-2"
                      >
                        Read more
                      </button>
                    </>
                  ) : (
                    <>
                      {formattedBio.map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ))}
                      {shouldTruncateBio && (
                        <button 
                          onClick={() => setShowFullBio(false)}
                          className="text-blue-400 hover:text-blue-300 mt-2"
                        >
                          Read less
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Known For */}
            {knownForCredits.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Known For</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {knownForCredits.map(credit => (
                    <Link 
                      key={credit.id} 
                      to={credit.media_type === 'movie' ? `/movies/${credit.id}` : `/tv/${credit.id}`}
                      className="group"
                    >
                      <div className="rounded-lg overflow-hidden bg-gray-800 shadow-md hover:shadow-blue-900/20 hover:shadow-lg transition-all">
                        <div className="aspect-[2/3] bg-gray-700">
                          <img
                            src={credit.poster_path ? `${SMALL_IMG_BASE_URL}${credit.poster_path}` : '/images/movie-placeholder.png'}
                            alt={credit.title || credit.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => { e.target.src = '/images/movie-placeholder.png' }}
                          />
                        </div>
                        <div className="p-2">
                          <h3 className="font-medium text-sm truncate">{credit.title || credit.name}</h3>
                          <div className="flex items-center text-xs text-gray-400 gap-1">
                            {credit.media_type === 'movie' ? (
                              <Film size={12} />
                            ) : (
                              <Tv size={12} />
                            )}
                            <span>{credit.media_type === 'movie' ? 'Movie' : 'TV'}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Link 
                    to={`/people/${people_id}/credits`}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    View all credits <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            )}
            
            {/* Acting Credits */}
            {credits && credits.cast && credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Acting</h2>
                <div className="space-y-2">
                  {credits.cast.slice(0, 10).map(credit => (
                    <Link 
                      key={`${credit.id}-${credit.character}`} 
                      to={credit.media_type === 'movie' ? `/movies/${credit.id}` : `/tv/${credit.id}`}
                      className="flex items-center p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{credit.title || credit.name}</h3>
                        {credit.character && (
                          <p className="text-sm text-gray-400">as {credit.character}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {credit.release_date || credit.first_air_date ? new Date(credit.release_date || credit.first_air_date).getFullYear() : 'TBA'}
                      </div>
                    </Link>
                  ))}
                </div>
                {credits.cast.length > 10 && (
                  <div className="mt-4">
                    <Link 
                      to={`/people/${people_id}/credits`}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      View all {credits.cast.length} acting credits <ExternalLink size={14} />
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Crew Credits (if they have any) */}
            {credits && credits.crew && credits.crew.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Behind the Scenes</h2>
                <div className="space-y-2">
                  {credits.crew.slice(0, 10).map(credit => (
                    <Link
                      key={`${credit.id}-${credit.job}`}
                      to={credit.media_type === 'movie' ? `/movies/${credit.id}` : `/tv/${credit.id}`}
                      className="flex items-center p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{credit.title || credit.name}</h3>
                        {credit.job && (
                          <p className="text-sm text-gray-400">{credit.job}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {credit.release_date || credit.first_air_date ? new Date(credit.release_date || credit.first_air_date).getFullYear() : 'TBA'}
                      </div>
                    </Link>
                  ))}
                </div>
                {credits.crew.length > 10 && (
                  <div className="mt-4">
                    <Link 
                      to={`/people/${people_id}/credits?tab=crew`}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      View all {credits.crew.length} crew credits <ExternalLink size={14} />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleDetails;