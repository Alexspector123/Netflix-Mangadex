import { useState } from 'react';
import axios from 'axios';

const apiUrl = "/api/v2/page";

function useUploadPages() {
  const [isUploading, setIsUploading] = useState(false);
  const [errorUpLoading, setErrorUpLoading] = useState(null);

  const uploadPages = async (chapterId, formData) => {
    try {
      setIsUploading(true);
      setErrorUpLoading(null);

      const mangaTitle = formData.get("manga_title");
      const chapterNumber = formData.get("chapter_number");

      const query = new URLSearchParams({
        manga_title: mangaTitle,
        chapter_number: chapterNumber,
      }).toString();

      const res = await axios.post(`${apiUrl}/${chapterId}?${query}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data;
    } catch (err) {
      setErrorUpLoading(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadPages, isUploading, errorUpLoading };
}

export default useUploadPages;
