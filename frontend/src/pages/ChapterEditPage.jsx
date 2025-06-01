import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import toast from "react-hot-toast";

import AddPageModal from "../components/modals/AddPageModal";
import { useParams } from "react-router-dom";

import useFetchChapterList from "../hooks/manga/useFetchChapterList";
import useFetchPageInfo from "../hooks/manga/useFetchPageInfo";
import useUploadPages from "../hooks/manga/useUploadPages";
import useDeletePage from "../hooks/manga/useDeletePage";
import useDeleteChapter from "../hooks/manga/useDeleteChapter";
import useUpdatePage from "../hooks/manga/useUpdatePage";
import useFetchChapterbyID from "../hooks/manga/useFetchChapterbyID";

const SortablePage = ({ id, url, index, isEditing, handleRemovePage }) => {
  const sortable = useSortable({ id });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = isEditing ? sortable : {
    attributes: {},
    listeners: {},
    setNodeRef: undefined,
    transform: null,
    transition: undefined,
    isDragging: false,
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={isEditing ? setNodeRef : null}
      {...(isEditing ? attributes : {})}
      style={style}
      className="relative bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg shadow hover:shadow-xl transition"
    >
      <div {...(isEditing ? listeners : {})}>
        <img
          src={url}
          alt={`Page ${index + 1}`}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemovePage(id);
          }}
          className="absolute top-2 right-2 bg-red-600 rounded-full p-1 text-white hover:bg-red-700 transition"
          title="Remove this page"
        >
          &times;
        </button>
      )}
    </div>
  );
};

const debouncedUpdate = debounce(async (newPages, updatePage) => {
  for (let i = 0; i < newPages.length; i++) {
    const page = newPages[i];
    try {
      await updatePage(page.id, {
        page_number: i + 1,
        image_url: page.url,
      });
    } catch (err) {
      console.error("Update error for page", page.id, err);
    }
  }
}, 500);

const ChapterEditPage = () => {
  const [pages, setPages] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { id, idc } = useParams();

  const { chapterIds, isLoading, error } = useFetchChapterList(id);
  const { pageList, isLoading: isLoadingPages, error: ErrorLoadingPages } = useFetchPageInfo(idc);
  const { chapterData, isLoading: isMangaLoading, error: ErrorManga } = useFetchChapterbyID(idc, 'db');
  const infor = chapterData?.dbResult;

  const { uploadPages } = useUploadPages();
  const { updatePage } = useUpdatePage();
  const { deletePage } = useDeletePage();

  const { deleteChapterById, isDeleting, deleteError, deleteSuccess } = useDeleteChapter();

  const sensors = useSensors(useSensor(PointerSensor));
const handleAddPages = async (files) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append("pages", file);
  });

  formData.append("manga_title", infor.mangaTitle);
  formData.append("chapter_number", infor.chapterNo);
  formData.append("chapter_title", infor.chapterTitle || "");

  try {
    const result = await uploadPages(idc, formData);
    if (result && result.data && result.data.pages) {
      setPages(prev => [...prev, ...result.data.pages]);

      toast.success(`Upload Success ${result.data.pages.length} trang!`);
    }
  } catch (error) {
    console.error(error);
    toast.error("Upload fail!");
  }
};


  const handleRemovePage = async (pageId) => {
    console.log("Clicked remove page:", pageId);
    if (!window.confirm("Are you sure you want to delete this page?")) return;
    const res = await deletePage(pageId);
    if (res) setPages((prev) => prev.filter((p) => p.id !== pageId));
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pages.findIndex((page) => page.id === active.id);
    const newIndex = pages.findIndex((page) => page.id === over.id);
    const newPages = arrayMove(pages, oldIndex, newIndex);
    setPages(newPages);

    debouncedUpdate(newPages, updatePage);
  };

  const handleDeleteChapter = async () => {
    const confirm = window.confirm("Do you want to delete this chapter?");
    if (!confirm) return;

    await deleteChapterById(idc);

    if (deleteSuccess) {
      toast.error("Chapter is deleted!");
      window.location.href = `/manga/${id}`;
    }
  };

  useEffect(() => {
    if (pageList) setPages(pageList);
  }, [pageList]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (ErrorLoadingPages) return <p className="text-red-500">{ErrorLoadingPages}</p>;

  return (
    !isMangaLoading && (
      <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8 flex flex-col md:flex-row gap-6">
        {/* Left section */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">
              Chapter {infor.chapterNo} - Edit Pages
            </h1>
            <p className="text-sm text-gray-400">
              Last updated: {new Date(infor.upload_date).toISOString().slice(0, 10)}
            </p>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={pages.map((p) => p.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {pages.map((page, index) => (
                  <SortablePage
                    key={page.id}
                    id={page.id}
                    url={page.url}
                    index={index}
                    isEditing={isEditing}
                    handleRemovePage={handleRemovePage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right sidebar */}
        <div className="relative w-full md:w-64 h-fit">
          <div className="w-full bg-[#1e1e1e] rounded-lg shadow-lg p-4 sticky top-4 border border-[#2e2e2e]">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>

            {/* Chapter dropdown */}
            <div className="relative mb-4">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full text-left px-4 py-2 rounded bg-[#2e2e2e] text-white hover:bg-[#3a3a3a] transition"
              >
                Chapter {infor.chapterNo}
              </button>
              {dropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-[#1e1e1e] border border-[#333] rounded shadow-lg">
                  {chapterIds?.map((chap) => (
                    <li
                      key={chap.id}
                      onClick={() => handleChapterSelect(chap.number)}
                      className="px-4 py-2 hover:bg-[#2a2a2a] cursor-pointer transition"
                    >
                      Chapter {chap.number}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full px-4 py-2 bg-[#e50914] text-white rounded hover:bg-[#b00610] transition"
              >
                ➕ Add Page
              </button>

              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className={`w-full px-4 py-2 rounded text-white transition ${isEditing
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-yellow-500 hover:bg-yellow-600 text-black"
                  }`}
              >
                {isEditing ? "✅ Done Editing" : "✏️ Edit Pages"}
              </button>

              <button
                onClick={handleDeleteChapter}
                disabled={isDeleting}
                className={`w-full px-4 py-2 rounded text-white transition ${isDeleting ? "bg-gray-600 cursor-not-allowed" : "bg-red-700 hover:bg-red-800"}`}
              >
                {isDeleting ? "Đang xoá..." : "🗑️ Delete Chapter"}
              </button>
            </div>
          </div>
        </div>

        {/* Add Page Modal */}
        <AddPageModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddPages={handleAddPages}
        />
      </div>
    )
  );
}
export default ChapterEditPage;
