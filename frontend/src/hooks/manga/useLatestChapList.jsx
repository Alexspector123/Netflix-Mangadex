import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const apiUrl = "/api/v2/chapter";

const useLatestChapList = () => {
    const [mangaList, setMangaList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestChapInfo = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await axios.get(`${apiUrl}/latest/info`, {
                    withCredentials: true,
                });
                setMangaList(res.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch manga list");
                setMangaList([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLatestChapInfo();
    }, []);
  return { mangaList, isLoading, error };
}

export default useLatestChapList;