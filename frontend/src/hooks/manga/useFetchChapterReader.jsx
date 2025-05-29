import { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = "/api/v2/chapter";

function useFetchChapterReader(id, source = 'api') {
  const [chapterReaderData, setChapterReaderData] = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]       = useState(null);
  useEffect(() => {
    const fetchChapterReader = async () => {
        try {
            setIsLoading(true);
            const chaptersRes = await axios.get(`${apiUrl}/reader/${id}?source=${source}`);
            setChapterReaderData(chaptersRes.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    if(id){
        fetchChapterReader();
    }
  }, [id, source]);

  return { chapterReaderData, isLoading, error };
};

export default useFetchChapterReader;

