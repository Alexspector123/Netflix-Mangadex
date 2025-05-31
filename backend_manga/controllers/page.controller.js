import { db } from '../config/db.js';

export const getPageList = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const [pages] = await db.execute(
      `SELECT page_id AS id, page_number, image_url AS url
       FROM Page WHERE chapter_id = ? ORDER BY page_number ASC`,
      [chapterId]
    );

    if (pages.length === 0) {
      return res.status(404).json({ message: "No pages found." });
    }
    return res.status(200).json(pages);
  } catch (error) {
    console.error("Error getting pages: ", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const createPages = async (req, res) => {
  try {
    const { chapterId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No pages need to upload" });
    }

    const [existingPages] = await db.execute(
      `SELECT MAX(page_number) AS maxPage FROM Page WHERE chapter_id = ?`,
      [chapterId]
    );

    let nextPageNumber = existingPages[0].maxPage ? existingPages[0].maxPage + 1 : 1;

    const newPages = req.files.map((file, index) => ({
      chapter_id: chapterId,
      page_number: nextPageNumber + index,
      image_url: file.path,
    }));

    const insertPromises = req.files.map((file, index) => {
      const imageUrl = file.path;
      return db.execute(
        `INSERT INTO Page (chapter_id, page_number, image_url) VALUES (?, ?, ?)`,
        [chapterId, nextPageNumber + index, imageUrl]
      );
    });

    await Promise.all(insertPromises);

    return res.status(201).json({ message: "Upload success", pages: newPages });
  } catch (error) {
    console.error('Create pages error:', error);
    return res.status(500).json({ message: 'Server error when create pages' });
  }
};

export const updatePage = async (req, res) => {
  try {
    const { pageId } = req.params;
    let { page_number, image_url } = req.body;

    if (page_number === undefined) page_number = null;
    if (image_url === undefined) image_url = null;

    const [result] = await db.execute(
      `UPDATE Page SET page_number = ?, image_url = ? WHERE page_id = ?`,
      [page_number, image_url, pageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Page not exists" });
    }
    return res.status(200).json({ message: "Update success" });
  } catch (error) {
    console.error("Update page error:", error);
    return res.status(500).json({ message: "Server error when update pages" });
  }
};

export const deletePage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const [result] = await db.execute(
      `DELETE FROM Page WHERE page_id = ?`,
      [pageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Page not exists" });
    }
    return res.status(200).json({ message: "Delete success" });
  } catch (error) {
    console.error("Delete page error:", error);
    return res.status(500).json({ message: "Server error when delete pages" });
  }
};
