import React, { useMemo, useState } from 'react';

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import { RiCloseLine } from "react-icons/ri";
import { FaFileAlt, FaUserFriends } from "react-icons/fa";
import { BsArrowsFullscreen } from "react-icons/bs";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import useFetchChapterbyID from '../hooks/manga/useFetchChapterbyID';
import useChapterList from '../hooks/manga/useChapterList';

import { useUIStore } from "../store/uiStore";

const ChapterSidebar = ({ closeSidebar, toggleHeader }) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const source = searchParams.get('source') || 'api';

  const { darkMode } = useUIStore();

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleChapterSelect = (chapter) => {
    navigate(`/chapter/${chapter.id}/1?source=${source}`);
    setDropdownOpen(false);
  };

  const { chapterData, isLoading: isChapterLoading, error: isChapterError } = useFetchChapterbyID(id, source);
  const mangaID = chapterData?.mangaID;

  const chapterList = source === 'db'
    ? useChapterList(mangaID)
    : useChapterList(mangaID);

  const { allChapters, isLoading, error: isVolumeLoading } = chapterList;

  const chapterInfo = chapterData?.dbResult;

  if (isChapterError) return <div>Error ChapterReading: {isChapterError}</div>;
  if (isVolumeLoading) return <div>Error ChapterReading: {isChapterError}</div>;

  const groupedChapter = useMemo(() => {
    if (!Array.isArray(allChapters) || !chapterData) return null;
    const sameGroupAndLanguage = allChapters.filter(
      chap => chap.group === chapterData.groupName && chap.translatedLanguage === chapterData.translatedLanguage
    );

    if (sameGroupAndLanguage) {
      return sameGroupAndLanguage;
    }

    const sameLanguage = allChapters.filter(
      chap => chap.translatedLanguage === chapterData.translatedLanguage
    );

    if (sameLanguage) {
      return sameLanguage;
    }

    return null;
  }, [allChapters, chapterData]);


  console.log(chapterInfo);

  const nextChapter = useMemo(() => {
    if (!Array.isArray(groupedChapter) || !chapterData) return null;

    if (groupedChapter) {
      return groupedChapter.find(chap => parseFloat(chap.chapter) === parseFloat(chapterData.chapterNo) + 1);
    }

    return null;
  }, [groupedChapter]);

  const prevChapter = useMemo(() => {
    if (!Array.isArray(groupedChapter) || !chapterData) return null;

    if (groupedChapter) {
      return groupedChapter.find(chap => parseFloat(chap.chapter) === parseFloat(chapterData.chapterNo) - 1);
    }

    return null;
  }, [groupedChapter]);

  const moveNextChapter = () => {
    if (!nextChapter || nextChapter === null) {
      navigate(`/watch/${chapterInfo.moviePageID}`);
    }
    else {
      navigate(`/chapter/${nextChapter.id}/1?source=${source}`);
    }
  }

  const movePrevChapter = () => {
    if (!prevChapter || prevChapter || null) {
      navigate(`/watch/${chapterInfo.moviePageID}`);
    }
    else {
      navigate(`/chapter/${prevChapter.id}/1?source=${source}`);
    }
  }

  return (
    <>
      {!isChapterLoading && (
        <div className="w-80 flex flex-col p-4 gap-4">
          <div className="flex justify-between">
            <button onClick={closeSidebar} className="text-2xl cursor-pointer">
              <RiCloseLine />
            </button>
            <button
              onClick={toggleHeader}
              className="text-xl cursor-pointer"
            >
              <BsArrowsFullscreen />
            </button>
          </div>

          <a
            className='text-base text-orange-500 font-semibold
                cursor-pointer'
            onClick={() => navigate(`/titles/${chapterData.mangaID}`)}
          >
            {chapterData.mangaTitle}</a>

          <div className="flex items-center gap-2 text-[18px]">
            <FaFileAlt />
            {chapterData.Title === null ? (chapterData.chapterNo === null ? 'Oneshot' : `Chapter ${chapterData.chapterNo}`) : chapterData.Title}
          </div>

          <div className="mt-4">

            <div className="flex items-center gap-3 relative">
              <div className={`h-14 w-7
                            flex text-center items-center justify-center
                            cursor-pointer
                            ${darkMode ? 'border' : 'bg-slate-200'} `}>
                <IoIosArrowBack
                  className='text-xl'
                  onClick={moveNextChapter} />
              </div>
              <div
                className={`flex-grow text-center p-4 rounded cursor-pointer
                        text-base
                        ${darkMode ? 'border' : 'bg-slate-200'} `}
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                Chapter {chapterData.chapterNo}
              </div>

              {isDropdownOpen && (
                <div className={`absolute top-full left-11 mt-1 w-50 bg-black border shadow-lg rounded-md z-10`}>
                  <ul className="max-h-60 overflow-y-auto">
                    {groupedChapter?.map((chapter) => (
                      <li
                        key={chapter.id}
                        className={`px-4 py-2 cursor-pointer ${chapter.id === chapterData.id ? 'bg-orange-500 font-semibold text-white' : ''}`}
                        onClick={() => handleChapterSelect(chapter)}
                      >
                        Chapter {chapter.chapter}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={` h-14 w-7
                            flex text-center items-center justify-center
                            cursor-pointer
                            ${darkMode ? 'border' : 'bg-slate-200'} `}>
                <IoIosArrowForward
                  className='text-xl'
                  onClick={movePrevChapter} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm mt-4">
            <div className="font-semibold">
              Uploaded By
            </div>
            <div className="flex items-center gap-2">
              <FaUserFriends />
              <div>{chapterInfo.uploaderName}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChapterSidebar;
