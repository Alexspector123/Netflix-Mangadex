import { useEffect, useState } from "react";
import { useContentStore } from "../../store/content.js";
import axios from "axios";

const useGetTrendingContent = () => {
  const { contentType } = useContentStore();
  const [main, setMain]     = useState(null);
  const [others, setOthers] = useState([]);

  useEffect(() => {
    const getHero = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/trending`, { withCredentials: true });
        setMain(res.data.main);
        setOthers(res.data.others);
      } catch (err) {
        console.error("❌ Failed to fetch hero content:", err);
      }
    };
    getHero();
  }, [contentType]);

  return { main, others };
};

export default useGetTrendingContent;
