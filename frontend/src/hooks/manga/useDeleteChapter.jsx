import { useState } from 'react';
import axios from 'axios';

const apiUrl = "/api/v2/chapter";

const useDeleteChapter = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const deleteChapterById = async (id) => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      setDeleteSuccess(false);

      await axios.delete(`${apiUrl}/${id}`);
      setDeleteSuccess(true);
    } catch (error) {
      setDeleteError(error.message || "Error delete chapter");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteChapterById,
    isDeleting,
    deleteError,
    deleteSuccess,
  };
};

export default useDeleteChapter;
