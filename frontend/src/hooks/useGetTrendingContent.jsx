import { useEffect, useState } from "react";
import { useContentStore } from "../store/content.js";
import axios from "axios";

const useGetTrendingContent = () => {
	const [trendingContent, setTrendingContent] = useState(null);
	const { contentType } = useContentStore();

	useEffect(() => {
		const getTrendingContent = async () => {
			try {
				const res = await axios.get(`/api/v1/${contentType}/trending`);
				console.log(contentType, res.data.content);
				setTrendingContent(res.data.content);
			} catch (err) {
				console.error("❌ Failed to fetch trending content:", err.message);
			}
		};
		getTrendingContent();
	}, [contentType]);

	return { trendingContent };
};
export default useGetTrendingContent;