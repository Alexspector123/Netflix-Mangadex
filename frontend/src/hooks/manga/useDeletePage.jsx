import { useState } from 'react';
import axios from 'axios';

const apiUrl = "/api/v2/page";

function useDeletePage() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deletePage = async (pageId) => {
    try {
      setIsDeleting(true);
      setError(null);
      const res = await axios.delete(`${apiUrl}/${pageId}`);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deletePage, isDeleting, error };
}

export default useDeletePage;
