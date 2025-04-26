import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight, Play, CirclePlus, Info } from "lucide-react";
import toast from "react-hot-toast";

const MovieSlider = ({ category }) => {
	const { contentType } = useContentStore();
	const [content, setContent] = useState([]);
	const [showArrows, setShowArrows] = useState(false);
	const [hoveredId, setHoveredId] = useState(null);
	const [favourites, setFavourites] = useState(new Set());
	const navigate = useNavigate();
	const sliderRef = useRef(null);

	const formattedCategoryName =
		category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
	const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";

	useEffect(() => {
		const getContent = async () => {
			const res = await axios.get(`/api/v1/${contentType}/${category}`, {
				withCredentials: true,
			});
			setContent(res.data.content);
		};

		getContent();
	}, [contentType, category]);

	const scrollLeft = () => sliderRef.current?.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
	const scrollRight = () => sliderRef.current?.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });

	const handleAddToFavourites = async (item) => {
		try {
			await axios.post("/api/v1/search/favourite", {
				id: item.id,
				image: item.poster_path || item.backdrop_path,
				title: item.title || item.name,
				type: contentType,
			});
			toast.success("Added to favourites");
			setFavourites((prev) => new Set(prev).add(item.id));
		} catch (err) {
			if (err.response?.status === 403) {
				toast.error("Only VIP accounts can save favourites");
				navigate("/profile");
			} else {
				console.error(err);
				toast.error("An error occurred");
			}
		}
	};

	return (
		<div className='bg-black text-white relative px-5 md:px-20' onMouseEnter={() => setShowArrows(true)} onMouseLeave={() => setShowArrows(false)}>
			<h2 className='mb-4 text-2xl font-bold'>{formattedCategoryName} {formattedContentType}</h2>

			<div className='flex space-x-4 overflow-x-visible scrollbar-hide' ref={sliderRef}>
				{content.map((item) => (
					<div key={item.id} onMouseEnter={() => setHoveredId(item.id)} onMouseLeave={() => setHoveredId(null)} className='relative min-w-[250px] group'>
						<Link to={`/watch/${item.id}`}>
							<div className='rounded-lg overflow-hidden'>
								<img src={SMALL_IMG_BASE_URL + item.backdrop_path} alt='Movie image' className='transition-transform duration-300 ease-in-out group-hover:scale-110 rounded-lg' />
							</div>
						</Link>
						<p className='mt-2 text-center text-sm font-medium'>{item.title || item.name}</p>

						{hoveredId === item.id && (
							<div className='absolute z-50 top-full left-0 w-80 bg-neutral-900 text-white rounded-lg shadow-xl p-4 mt-2 animate-fade-in'>
								<img src={SMALL_IMG_BASE_URL + item.backdrop_path} alt='Preview' className='rounded-md mb-2 h-40 w-full object-cover' />
								<div className='flex gap-3 mb-2'>
									<Link to={`/watch/${item.id}`}><Play className='cursor-pointer hover:text-red-500' /></Link>
									{!favourites.has(item.id) && (
										<CirclePlus
											onClick={() => handleAddToFavourites(item)}
											className='cursor-pointer hover:text-red-500'
										/>
									)}
									<Link to={`/watch/${item.id}`}><Info className='cursor-pointer hover:text-red-500' /></Link>
								</div>
								<div className='flex items-center gap-2 text-sm text-gray-400'>
									<span>T18</span>
									<span>12 tập</span>
									<span>HD</span>
								</div>
								<p className='text-sm mt-1 text-gray-300'>Giàu trí tưởng tượng</p>
							</div>
						)}
					</div>
				))}
			</div>

			{showArrows && (
				<>
					<button className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10' onClick={scrollLeft}><ChevronLeft size={24} /></button>
					<button className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10' onClick={scrollRight}><ChevronRight size={24} /></button>
				</>
			)}
		</div>
	);
};

export default MovieSlider;
