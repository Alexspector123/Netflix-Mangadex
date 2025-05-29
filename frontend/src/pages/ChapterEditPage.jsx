import React, { useState } from "react";
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

import AddPageModal from "../components/AddPageModal";

const chapters = [
  { id: "1", number: "1" },
  { id: "2", number: "2" },
  { id: "3", number: "3" },
];

const SortablePage = ({ id, url, index, isEditing, handleRemovePage }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="relative bg-white rounded shadow p-2 hover:shadow-md transition"
    >
      <img
        src={url}
        alt={`Page ${index + 1}`}
        className="w-full h-64 object-cover rounded"
      />
      {isEditing && (
        <button
          onClick={() => handleRemovePage(id)}
          className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white hover:bg-red-700 transition"
          title="Remove this page"
        >
          &times;
        </button>
      )}
    </div>
  );
};

const ChapterEditPage = () => {
  const [pages, setPages] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddPages = (files) => {
    const newPages = files.map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file,
    }));
    setPages((prev) => [...prev, ...newPages]);
  };

  const [selectedChapter, setSelectedChapter] = useState("1");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleChapterSelect = (number) => {
    setSelectedChapter(number);
    setDropdownOpen(false);
  };

  const handleRemovePage = (id) => {
    setPages((prev) => prev.filter((page) => page.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pages.findIndex((page) => page.id === active.id);
    const newIndex = pages.findIndex((page) => page.id === over.id);

    setPages((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col md:flex-row gap-6">
      {/* Left content */}
      <div className="flex-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Chapter {selectedChapter} - Edit Pages
          </h1>
          <p className="text-sm text-gray-600">Last updated: 2025-05-20</p>
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
        <div className="w-full bg-white rounded shadow p-4 sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>

          <div className="relative mb-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full text-left px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
            >
              Chapter {selectedChapter} ▼
            </button>
            {dropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
                {chapters.map((chap) => (
                  <li
                    key={chap.id}
                    onClick={() => handleChapterSelect(chap.number)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Chapter {chap.number}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Page
            </button>

            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className={`w-full px-4 py-2 rounded text-white transition ${
                isEditing ? "bg-blue-700 hover:bg-blue-800" : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {isEditing ? "Done Editing" : "Edit Pages"}
            </button>

            <button
              onClick={() => setPages([])}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete All Pages
            </button>
          </div>
        </div>
      </div>

      <AddPageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPages={handleAddPages}
      />
    </div>
  );
};

export default ChapterEditPage;
