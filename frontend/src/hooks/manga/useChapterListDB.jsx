import React, { useMemo } from "react";
import useFetchChapterList from "./useFetchChapterList";
import { useBatchChapters } from "./useBatchChapters";

const useChapterListDB = (mangaID) => {
  const { chapterIds, isLoading: isVolumeLoading, error: volumeError } = useFetchChapterList(mangaID);
  
  const chapterById = useMemo(() => chapterIds.map(c => c.id), [chapterIds]);
  const { chapters, loading: isChapterLoading, error: chapterError } = useBatchChapters(chapterById, 'db');

  if (chapterError) return <div>Error: {chapterError}</div>;

  return {
    allChaptersDB: chapters,
    isLoading: isVolumeLoading || isChapterLoading,
    error: volumeError || chapterError,
  };
}

export default useChapterListDB