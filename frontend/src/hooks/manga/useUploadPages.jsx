import { useState } from 'react';
import axios from 'axios';

const apiUrl = "/api/v2/page";

function useUploadPages() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadPages = async (chapterId, formData) => {
    try {
      setIsUploading(true);
      setError(null);

      // Lấy manga_title và chapter_number từ formData
      const mangaTitle = formData.get("manga_title");
      const chapterNumber = formData.get("chapter_number");

      // Tạo query string
      const query = new URLSearchParams({
        manga_title: mangaTitle,
        chapter_number: chapterNumber,
      }).toString();

      const res = await axios.post(`${apiUrl}/${chapterId}?${query}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadPages, isUploading, error };
}

export default useUploadPages;
