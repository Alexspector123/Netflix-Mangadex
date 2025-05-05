import { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = '/api/v2/chapter';

function splitIntoBatches(arr, batchSize = 50) {
    const batches = [];
    for (let i = 0; i < arr.length; i += batchSize) {
      batches.push(arr.slice(i, i + batchSize));
    }
    return batches;
}

export function useBatchChapters(ids) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchBatchChapter = async () => {
        try {
            setLoading(true);
            const batches = splitIntoBatches(ids, 50);
            const results = [];
    
            for (const batch of batches) {
              const res = await axios.post(`${apiUrl}/batch`, { ids: batch });
              results.push(...res.data);
            }
    
            setChapters(results);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    if(ids){
        fetchBatchChapter();
    }
  }, [ids]);

  return { chapters, loading, error };
}
