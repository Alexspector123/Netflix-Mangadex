import { useState } from 'react';
import axios from 'axios';

const apiUrl = "/api/v2/page";

function useUpdatePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updatePage = async (pageId, data) => {
    try {
      setIsUpdating(true);
      setError(null);
      const res = await axios.put(`${apiUrl}/${pageId}`, data);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updatePage, isUpdating, error };
}

export default useUpdatePage;
