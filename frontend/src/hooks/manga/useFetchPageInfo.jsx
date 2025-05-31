import { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = "/api/v2/page";

function useFetchPageInfo(id) {
  const [pageList, setPageList] = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchPageInfo = async () => {
        try {
            setIsLoading(true);
            const chaptersRes = await axios.get(`${apiUrl}/${id}`);
            setPageList(chaptersRes.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    if(id){
        fetchPageInfo();
    }
  }, [id]);

  return { pageList, isLoading, error };
};

export default useFetchPageInfo;

