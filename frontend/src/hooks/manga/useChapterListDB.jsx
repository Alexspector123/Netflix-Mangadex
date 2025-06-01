import React, { useMemo } from "react";
import useFetchChapterList from "./useFetchChapterList";
import { useBatchChapters } from "./useBatchChapters";

const useChapterListDB = (mangaID) => {
  const { chapterIds, isLoading: isVolumeLoading, error: volumeError } = useFetchChapterList(mangaID);
  
  const chapterById = useMemo(() => chapterIds.map(c => c.id), [chapterIds]);
  const { chapters, loading: isChapterLoading, error: chapterError } = useBatchChapters(chapterById, 'db');

  // Không trả về JSX, chỉ trả về dữ liệu, loading, error
  if (chapterError) {
    console.error("Chapter Error:", chapterError);
  }

  return {
    allChaptersDB: chapters || [],
    isLoading: isVolumeLoading || isChapterLoading,
    error: volumeError || chapterError,
  };
}

export default useChapterListDB;
