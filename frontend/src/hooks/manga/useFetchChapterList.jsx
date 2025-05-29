import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = "/api/v2/manga";

const useFetchChapterList = (id) => {
  const [chapterIds, setChapterIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolumeByID = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(`${apiUrl}/${id}/chapter/db`);
        setChapterIds(res.data);
      } catch (error) {
        setError(error.message);
        setChapterIds([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVolumeByID();
    } else {
      setChapterIds([]);
      setIsLoading(false);
      setError(null);
    }
  }, [id]);

  return { chapterIds, isLoading, error };
}

export default useFetchChapterList;
