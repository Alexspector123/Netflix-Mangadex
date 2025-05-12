import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";

import { ChevronLeft, ChevronRight, Star, Clock, Calendar, Film, Users, Globe, Info, CirclePlus, LibraryBig } from "lucide-react";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";

import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import { formatReleaseDate } from "../utils/dateFunction";

import Navbar from "../components/Navbar";
import WatchPageSkeleton from "../components/skeletons/WatchPageSkeleton";
import useChapterList from "../hooks/manga/useChapterList";
import ReadModal from "../components/ReadModal";

import { BiNavigation } from "react-icons/bi";

const WatchPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [trailers, setTrailers] = useState([]);
	const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState({});
	const [similarContent, setSimilarContent] = useState([]);
	const [cast, setCast] = useState([]);
	const [showMore, setShowMore] = useState(false);
	const { contentType } = useContentStore();
	const [isFavourite, setIsFavourite] = useState(false);

	const [mangaData, SetMangaData] = useState({ manga: [] });
	const [showReadModal, setShowReadModal] = useState(false);

	const sliderRef = useRef(null);
	const castSliderRef = useRef(null);

	// For start reading modal
	const readModalRef = useRef();
	useEffect(() => {
		const handleClickOutsideDesktop = (e) => {
			if (readModalRef.current && readModalRef.current.contains(e.target)) {
				setShowReadModal(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutsideDesktop);
		return () => {
			document.removeEventListener("mousedown", handleClickOutsideDesktop);
		};
	}, []);

	useEffect(() => {
		const getTrailers = async () => {
			try {
				const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
				setTrailers(res.data.trailers);
			} catch (error) {
				if (error.message.includes("404")) {
					setTrailers([]);
				}
			}
		};

		getTrailers();
	}, [contentType, id]);

	useEffect(() => {
		const getSimilarContent = async () => {
			try {
				const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
				setSimilarContent(res.data.similar);
			} catch (error) {
				if (error.message.includes("404")) {
					setSimilarContent([]);
				}
			}
		};

		getSimilarContent();
	}, [contentType, id]);

	useEffect(() => {
		const getContentDetails = async () => {
			try {
				const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
				setContent(res.data.content);
			} catch (error) {
				if (error.message.includes("404")) {
					setContent(null);
				}
			} finally {
				setLoading(false);
			}
		};

		getContentDetails();
	}, [contentType, id]);

	useEffect(() => {
		const getCastInfo = async () => {
			try {
				const res = await axios.get(`/api/v1/${contentType}/${id}/credits`);
				setCast(res.data.cast);
			} catch (error) {
				console.error("Failed to fetch cast information:", error);
				setCast([]);
			}
		};

		getCastInfo();
	}, [contentType, id]);

	const handleNext = () => {
		if (currentTrailerIdx < trailers.length - 1) setCurrentTrailerIdx(currentTrailerIdx + 1);
	};
	const handlePrev = () => {
		if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
	};

	const scrollLeft = (ref) => {
		if (ref.current) ref.current.scrollBy({ left: -ref.current.offsetWidth, behavior: "smooth" });
	};
	const scrollRight = (ref) => {
		if (ref.current) ref.current.scrollBy({ left: ref.current.offsetWidth, behavior: "smooth" });
	};

	const formatRuntime = (minutes) => {
		if (!minutes) return "Unknown";
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	useEffect(() => {
		const getManga = async () => {
			if (!content?.name?.trim()) {
				SetMangaData({ manga: [] });
				return;
			}
			try {
				const res = await axios.get(`/api/v2/manga/search?query=${content.name}`);
				SetMangaData(res.data);
			} catch (error) {
				console.error("Error fetching search results", error);
			}
		};

		getManga();
	}, [content]);

	const { allChapters, isLoading: isLoadingChapterList, error: ChapterListError } = useChapterList(mangaData?.manga?.[0]?.id);
	if (ChapterListError) return <div>Error: {ChapterListError}</div>;

	const handleAddToFavourites = async () => {
		try {
			const payload = {
				id: content.id,
				image: content.poster_path || content.backdrop_path,
				title: content.title || content.name,
				type: contentType,
			};
			await axios.post("/api/v1/search/favourite", payload);
			setIsFavourite(true);
			toast.success("Added to favourites!");
		} catch (err) {
			if (err.response?.status === 403) {
				toast.error("Only VIP accounts can save favourites");
				navigate("/profile");
			} else {
				toast.error("Failed to add to favourites");
			}
		}
	};

	if (loading)
		return (
			<div className="min-h-screen bg-black p-10">
				<WatchPageSkeleton />
			</div>
		);

	if (!content) {
		return (
			<div className="bg-black text-white h-screen">
				<div className="max-w-6xl mx-auto">
					<Navbar />
					<div className="text-center mx-auto px-4 py-8 h-full mt-40">
						<h2 className="text-2xl sm:text-5xl font-bold text-balance">Content not found 😥</h2>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='transition-all duration-200'>
			{showReadModal && <ReadModal readModalRef={readModalRef} onClose={() => setShowReadModal(false)} allChapters={allChapters} />}
			<div
				className="bg-gradient-to-b from-black to-gray-900 min-h-screen text-white"
				style={{
					backgroundImage: content.backdrop_path ?
						`linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.95)), 
						url(${ORIGINAL_IMG_BASE_URL + content.backdrop_path})` : '',
					backgroundSize: 'cover',
					backgroundPosition: 'center top',
					backgroundAttachment: 'fixed'
				}}
			>
				<div className="mx-auto container px-4 py-20 h-full">
					<Navbar />

					{trailers.length > 0 && (
						<div className="relative">
							<div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
								<ReactPlayer
									controls={true}
									width={"100%"}
									height={"70vh"}
									className="mx-auto overflow-hidden rounded-lg shadow-2xl"
									url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`}
								/>
							</div>

							<div className="flex justify-between items-center mb-4 absolute top-1/2 left-0 right-0 px-4">
								<button
									className={`
									bg-gray-800/80 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${currentTrailerIdx === 0 ? "opacity-50 cursor-not-allowed" : ""
										}`}
									disabled={currentTrailerIdx === 0}
									onClick={handlePrev}
								>
									<ChevronLeft size={24} />
								</button>

								<button
									className={`
									bg-gray-800/80 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${currentTrailerIdx === trailers.length - 1 ? "opacity-50 cursor-not-allowed" : ""
										}`}
									disabled={currentTrailerIdx === trailers.length - 1}
									onClick={handleNext}
								>
									<ChevronRight size={24} />
								</button>
							</div>
						</div>
					)}

					{trailers?.length === 0 && (
						<div className="flex justify-center items-center h-64 mb-8 bg-gray-900/50 rounded-lg">
							<h2 className="text-xl text-center">
								No trailers available for{" "}
								<span className="font-bold text-red-600">{content?.title || content?.name}</span> 😥
							</h2>
						</div>
					)}

					{/* movie details */}
					<div className="flex flex-col md:flex-row items-start justify-between gap-8 max-w-6xl mx-auto bg-gray-900/70 rounded-xl p-6 shadow-xl">
						<img
							src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
							alt="Poster image"
							className="max-h-[450px] rounded-md shadow-lg mx-auto md:mx-0"
						/>

						<div className="flex-1">
							<div className="flex items-center justify-between">
								{/* Tiêu đề */}
								<h2 className="text-4xl md:text-5xl font-bold">{content.title || content.name}</h2>

								{/* NHÓM NÚT */}
								<div className="flex items-center gap-0.5">
									{/* 1) Add to favourites */}
									<button
										onClick={handleAddToFavourites}
										disabled={isFavourite}
										className="p-2 rounded-full transition hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<CirclePlus size={28} fill={isFavourite ? 'white' : 'none'} />
									</button>
									{/* Manga button */}
									{mangaData && (
										<button className="p-2 rounded-full transition hover:bg-gray-800/50"
											onClick={() => setShowReadModal(true)}><LibraryBig size={28} />
										</button>
									)}
								</div>
							</div>



							<div className="flex flex-wrap items-center gap-4 mt-3 text-gray-300">
								<div className="flex items-center gap-1">
									<Calendar size={16} />
									<span>{formatReleaseDate(content?.release_date || content?.first_air_date)}</span>
								</div>

								{content?.runtime && (
									<div className="flex items-center gap-1">
										<Clock size={16} />
										<span>{formatRuntime(content.runtime)}</span>
									</div>
								)}

								{content?.adult !== undefined && (
									<div className="flex items-center gap-1">
										<Info size={16} />
										{content?.adult ? (
											<span className="text-red-500 font-semibold">18+</span>
										) : (
											<span className="text-green-500 font-semibold">PG-13</span>
										)}
									</div>
								)}

								{content?.vote_average && (
									<div className="flex items-center gap-1">
										<Star size={16} className="text-yellow-400 fill-yellow-400" />
										<span>{content.vote_average.toFixed(1)}/10</span>
									</div>
								)}
							</div>

							{content?.tagline && (
								<p className="mt-2 text-gray-400 italic">{content.tagline}</p>
							)}

							<div className="mt-4">
								<h3 className="text-xl font-semibold mb-2">Overview</h3>
								<p className="text-gray-300">
									{showMore || content?.overview?.length <= 300
										? content?.overview
										: `${content?.overview?.substring(0, 300)}...`}
									{content?.overview?.length > 300 && (
										<button
											onClick={() => setShowMore(!showMore)}
											className="ml-2 text-red-500 hover:text-red-400 font-medium"
										>
											{showMore ? "Show less" : "Show more"}
										</button>
									)}
								</p>
							</div>

							{/* Additional Details */}
							<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
								{content?.genres && content.genres.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
											<Film size={18} /> Genres
										</h3>
										<div className="flex flex-wrap gap-2">
											{content.genres.map(genre => (
												<span
													key={genre.id}
													className="bg-red-700/70 text-white px-3 py-1 rounded-full text-sm"
												>
													{genre.name}
												</span>
											))}
										</div>
									</div>
								)}

								{content?.production_companies && content.production_companies.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
											<Users size={18} /> Production
										</h3>
										<p>{content.production_companies.map(c => c.name).join(", ")}</p>
									</div>
								)}

								{content?.production_countries && content.production_countries.length > 0 && (
									<div>
										<h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
											<Globe size={18} /> Countries
										</h3>
										<p>{content.production_countries.map(c => c.name).join(", ")}</p>
									</div>
								)}

								{content?.budget > 0 && (
									<div>
										<h3 className="text-lg font-semibold mb-1">Budget</h3>
										<p>${content.budget.toLocaleString()}</p>
									</div>
								)}

								{content?.revenue > 0 && (
									<div>
										<h3 className="text-lg font-semibold mb-1">Revenue</h3>
										<p>${content.revenue.toLocaleString()}</p>
									</div>
								)}

								{content?.status && (
									<div>
										<h3 className="text-lg font-semibold mb-1">Status</h3>
										<p>{content.status}</p>
									</div>
								)}

								{content?.original_language && (
									<div>
										<h3 className="text-lg font-semibold mb-1">Language</h3>
										<p>{content.original_language.toUpperCase()}</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Manga button */}
					{mangaData.manga && (
						<button className="bg-blue-500 hover:bg-blue-600
						p-4
						text-lg
						text-white font-semibold
						cursor-pointer
						rounded
						transition-all duration-200
						mx-auto 2xl:ml-45
						"
						onClick={() => setShowReadModal(true)}>Read Manga<BiNavigation className="text-xl inline ml-2"/>
						</button>
					)}

					{/* Cast Information */}
					{cast.length > 0 && (
						<div className="mt-12 max-w-4xl mx-auto">
							<h3 className="text-2xl font-bold mb-4 pl-2 flex items-center gap-2">
								<Users size={24} /> Cast
							</h3>

							<div className="relative px-12">
								<div
									className="flex overflow-x-scroll scrollbar-hide gap-4 pb-1 px-2 snap-x"
									ref={castSliderRef}
								>
									{cast.slice(0, 20).map((person, index) => (
										<div key={person.id} className={`w-36 flex-none ${index % 5 === 0 ? 'scroll-snap-start' : ''}`}>
											<img
												src={person.profile_path
													? SMALL_IMG_BASE_URL + person.profile_path
													: "/placeholder-avatar.png"}
												alt={person.name}
												className="w-full h-48 object-cover rounded-md shadow-md"
											/>
											<h4 className="mt-2 text-sm font-semibold">{person.name}</h4>
											<p className="text-xs text-gray-400">{person.character}</p>
										</div>
									))}
								</div>

								<ChevronRight
									className="absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10
                    bg-red-600 hover:bg-red-700 text-white rounded-full p-2
                    shadow-lg cursor-pointer transition-all duration-300"
									onClick={() => scrollRight(castSliderRef)}
								/>
								<ChevronLeft
									className="absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10
                    bg-red-600 hover:bg-red-700 text-white rounded-full p-2
                    shadow-lg cursor-pointer transition-all duration-300"
									onClick={() => scrollLeft(castSliderRef)}
								/>
							</div>
						</div>
					)}

					{/* Similar Content */}
					{similarContent.length > 0 && (
						<div className="mt-12 max-w-3.2xl mx-auto">
							<h3 className="text-2xl font-bold mb-4 pl-2">Similar {contentType === "movie" ? "Movies" : "Shows"}</h3>

							<div className="relative px-12">
								<div
									className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 px-2 snap-x"
									ref={sliderRef}
								>
									{similarContent.map((content, index) => {
										if (content.poster_path === null) return null;
										return (
											<Link
												key={content.id}
												to={`/watch/${content.id}`}
												className={`w-48 flex-none hover:scale-105 transition-transform duration-300 ${index % 4 === 0 ? 'scroll-snap-start' : ''}`}
											>
												<img
													src={SMALL_IMG_BASE_URL + content.poster_path}
													alt={content.title || content.name}
													className="w-full h-auto rounded-md shadow-lg"
												/>
												<div className="mt-2">
													<h4 className="text-lg font-semibold">{content.title || content.name}</h4>
													{content.vote_average && (
														<div className="flex items-center gap-1 mt-1">
															<Star size={14} className="text-yellow-400 fill-yellow-400" />
															<span className="text-sm">{content.vote_average.toFixed(1)}/10</span>
														</div>
													)}
												</div>
											</Link>
										);
									})}
								</div>

								<ChevronRight
									className="absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10
                    bg-red-600 hover:bg-red-700 text-white rounded-full p-2
                    shadow-lg cursor-pointer transition-all duration-300"
									onClick={() => scrollRight(sliderRef)}
								/>
								<ChevronLeft
									className="absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10
                    bg-red-600 hover:bg-red-700 text-white rounded-full p-2
                    shadow-lg cursor-pointer transition-all duration-300"
									onClick={() => scrollLeft(sliderRef)}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>

	);
};

export default WatchPage;