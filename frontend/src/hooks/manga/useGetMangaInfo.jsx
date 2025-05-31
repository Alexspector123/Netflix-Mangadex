import { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = "/api/v2/manga";

function useGetMangaInfo(id) {
  const [manga, setManga] = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchMangaInfo = async () => {
        try {
            setIsLoading(true);
            const chaptersRes = await axios.get(`${apiUrl}/${id}`);
            setManga(chaptersRes.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    if(id){
        fetchMangaInfo();
    }
  }, [id]);

  return { manga, isLoading, error };
};

export default useGetMangaInfo;

