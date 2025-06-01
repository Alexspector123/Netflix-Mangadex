import axios from 'axios';
import mangadexLimiter from '../utils/rateLimiter.js';
import toRelativeTime from '../utils/toRelativeTime.js';
import { db } from '../config/db.js';

const fetchChapterListFromDB = async (limit = 10, order = 'desc') => {
  const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  const [rows] = await db.execute(
    `SELECT c.chapter_id, c.chapter_number, c.title AS chapter_title, c.upload_date,
            c.uploader_id, m.manga_id, m.title AS manga_title, m.cover_url, u.username AS uploader_name
     FROM Chapter c
     JOIN Manga m ON c.manga_id = m.manga_id
     JOIN Users u ON c.uploader_id = u.userId
     ORDER BY c.upload_date ${sortOrder}
     LIMIT ?`,
    [Number(limit)]
  );

  return rows.map(row => ({
    chapterID: row.chapter_id,
    chapter: row.chapter_number,
    chapterTitle: row.chapter_title,
    mangaID: row.manga_id,
    mangaTitle: row.manga_title,
    coverUrl: row.cover_url,
    language: row.translatedLanguage,
    uploaderName: row.uploader_name,
    updatedAt: toRelativeTime(row.upload_date),
  }));
};
const fetchChapterListFromAPI = async (limit = 10, order = 'desc') => {
  const queryString = `limit=${limit}&order[readableAt]=${order}`;

  const response = await mangadexLimiter.schedule(() =>
    axios.get(`https://api.mangadex.org/chapter?${queryString}`, {
      headers: {
        'User-Agent': 'MyApp/2.0 (alexspector8766@gmail.com)',
      },
    })
  );

  const chapterList = response.data.data;

  return await Promise.all(chapterList.map(async (chapter) => {
    const mangaRel = chapter.relationships.find(r => r.type === 'manga');
    const groupRel = chapter.relationships.find(r => r.type === 'scanlation_group');

    const mangaID = mangaRel?.id;
    const groupID = groupRel?.id;

    const mangaRes = await axios.get(`https://api.mangadex.org/manga/${mangaID}`);
    const mangaTitle = Object.values(mangaRes.data.data.attributes.title)[0];

    const coverRel = mangaRes.data.data.relationships.find(rel => rel.type === 'cover_art');
    const coverID = coverRel?.id;
    const coverRes = await axios.get(`https://api.mangadex.org/cover/${coverID}`);
    const coverFileName = coverRes.data.data.attributes.fileName;
    const coverUrl = `https://uploads.mangadex.org/covers/${mangaID}/${coverFileName}`;

    let groupName = '';
    if (groupID) {
      const groupRes = await axios.get(`https://api.mangadex.org/group/${groupID}`);
      groupName = groupRes.data.data.attributes.name;
    }

    return {
      mangaID,
      mangaTitle,
      coverUrl,
      chapter: chapter.attributes.chapter,
      volume: chapter.attributes.volume,
      language: chapter.attributes.translatedLanguage,
      group: groupName,
      updatedAt: toRelativeTime(chapter.attributes.readableAt),
    };
  }));
};
// Get chapter list information
export const fetchChapterList = async (req, res) => {
  const { limit = 10, order = 'desc', source } = req.query;

  try {
    let dbResults = [];
    let apiResults = [];

    if (source === 'db') {
      dbResults = await fetchChapterListFromDB(limit, order);
    } else if (source === 'api') {
      apiResults = await fetchChapterListFromAPI(limit, order);
    } else {
      [dbResults, apiResults] = await Promise.all([
        fetchChapterListFromDB(limit, order),
        fetchChapterListFromAPI(limit, order),
      ]);
    }

    return res.status(200).json({ dbResults, apiResults });
  } catch (error) {
    console.error('Error fetching chapter list:', error.message);
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait and try again.' });
    }
    return res.status(500).json({ error: 'An error occurred while fetching chapter data.' });
  }
};

const fetchChapterByIDFromDB = async (id) => {
  const [rows] = await db.execute(
    `SELECT c.chapter_id, c.chapter_number, c.title AS chapter_title, c.upload_date, c.translated_language,
            c.uploader_id, m.manga_id, m.title AS manga_title, u.username AS uploader_name,
            m.moviepage_id
     FROM Chapter c
     JOIN Manga m ON c.manga_id = m.manga_id
     JOIN Users u ON c.uploader_id = u.userId
     WHERE c.chapter_id = ?`,
    [id]
  );

  if (rows.length === 0) return null;

  const chapter = rows[0];

  return {
    id: chapter.chapter_id,
    chapterNo: chapter.chapter_number,
    title: chapter.chapter_title,
    upload_date: chapter.upload_date,
    releaseTime: toRelativeTime(chapter.upload_date),
    translatedLanguage: chapter.translated_language,
    uploaderName: chapter.uploader_name,
    mangaID: chapter.manga_id,
    mangaTitle: chapter.manga_title,
    moviePageID: chapter.moviepage_id
  };
};
const fetchChapterByIDFromAPI = async (id) => {
  const chapterRes = await mangadexLimiter.schedule(() =>
    axios.get(`https://api.mangadex.org/chapter/${id}`, {
      headers: {
        'User-Agent': 'MyApp/2.0 (alexspector8766@gmail.com)',
      },
    })
  );

  const chapter = chapterRes.data.data;
  const chapterTitle = chapter.attributes?.title;
  const chapterNo = chapter.attributes?.chapter;
  const updatedAt = toRelativeTime(chapter.attributes.readableAt);
  const translatedLanguage = chapter.attributes?.translatedLanguage;

  const mangaRel = chapter.relationships.find(r => r.type === 'manga');
  const groupRel = chapter.relationships.find(r => r.type === 'scanlation_group');

  const mangaID = mangaRel?.id;
  const groupID = groupRel?.id;

  const mangaRes = await axios.get(`https://api.mangadex.org/manga/${mangaID}`);
  const mangaTitle = Object.values(mangaRes.data.data.attributes.title)[0];

  let groupName = '';
  if (groupID) {
    const groupRes = await axios.get(`https://api.mangadex.org/group/${groupID}`);
    groupName = groupRes.data.data.attributes.name;
  }

  return {
    id,
    title: chapterTitle,
    chapterNo,
    releaseTime: updatedAt,
    groupName,
    translatedLanguage,
    mangaID,
    mangaTitle,
  };
};
// Get specific chapter information
export const fetchChapterByID = async (req, res) => {
  const { id } = req.params;
  const { source } = req.query;

  try {
    let dbResult = null;
    let apiResult = null;

    if (source === 'db') {
      dbResult = await fetchChapterByIDFromDB(id);
      if (!dbResult) return res.status(404).json({ error: 'Chapter is not existed in DB' });
    } else if (source === 'api') {
      apiResult = await fetchChapterByIDFromAPI(id);
    } else {
      [dbResult, apiResult] = await Promise.all([
        fetchChapterByIDFromDB(id),
        fetchChapterByIDFromAPI(id),
      ]);
    }

    return res.status(200).json({ dbResult, apiResult });

  } catch (error) {
    console.error('Error fetching chapter by ID:', error.message);
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait and try again.' });
    }
    return res.status(500).json({ error: 'Failed to fetch chapter by ID.' });
  }
};

const fetchChaptersBatchFromDB = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await db.execute(
    `SELECT c.chapter_id, c.chapter_number, c.title AS chapter_title, c.upload_date, c.translated_language,
            c.uploader_id, u.username AS uploader_name
     FROM Chapter c
     JOIN Users u ON c.uploader_id = u.userId
     WHERE c.chapter_id IN (${placeholders})`,
    ids
  );

  return rows.map(row => ({
    id: row.chapter_id,
    chapter: row.chapter_number,
    title: row.chapter_title,
    uploaderName: row.uploader_name,
    translatedLanguage: row.translated_language,
    readableAt: toRelativeTime(row.upload_date),
  }));
};
const fetchChaptersBatchFromAPI = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];

  const results = await Promise.all(
    ids.map(id =>
      mangadexLimiter.schedule(() =>
        axios
          .get(`https://api.mangadex.org/chapter/${id}`, {
            headers: { 'User-Agent': 'MyApp/2.0 (alexspector8766@gmail.com)' },
          })
          .then(async r => {
            const d = r.data.data;
            const groupRel = d.relationships.find(r => r.type === 'scanlation_group');
            const groupID = groupRel?.id;

            let groupName = '';
            if (groupID) {
              const groupRes = await axios.get(`https://api.mangadex.org/group/${groupID}`);
              groupName = groupRes.data.data.attributes.name;
            }

            return {
              id,
              title: d.attributes.title,
              readableAt: toRelativeTime(d.attributes.readableAt),
              chapter: d.attributes.chapter,
              volume: d.attributes.volume,
              translatedLanguage: d.attributes.translatedLanguage,
              group: groupName,
            };
          })
          .catch(() => null)
      )
    )
  );

  return results.filter(Boolean);
};
// Get chapter list base on id list
export const fetchChaptersBatch = async (req, res) => {
  const { ids } = req.body;
  const { source } = req.query;

  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'Request body must be { ids: string[] }' });
  }

  try {
    let dbResult = null;
    let apiResult = null;

    if (source === 'db') {
      dbResult = await fetchChaptersBatchFromDB(ids);
      return res.json(dbResult);
    }

    if (source === 'api') {
      apiResult = await fetchChaptersBatchFromAPI(ids);
      return res.json(apiResult);
    }

    // Nếu không có query `source`, thì trả cả hai
    [dbResult, apiResult] = await Promise.all([
      fetchChaptersBatchFromDB(ids),
      fetchChaptersBatchFromAPI(ids),
    ]);

    return res.json({ dbResult, apiResult });

  } catch (err) {
    console.error('Batch chapters error:', err);
    res.status(500).json({ error: 'Failed to fetch chapters batch' });
  }
};

const fetchChapterReaderFromDB = async (chapterId) => {
  const [pages] = await db.execute(
    `SELECT page_id, page_number, image_url FROM Page WHERE chapter_id = ? ORDER BY page_number ASC`,
    [chapterId]
  );

  if (pages.length === 0) {
    return null;
  }

  return pages.map(p => p.image_url);
};
const fetchChapterReaderFromAPI = async (chapterId) => {
  const chapterReaderRes = await mangadexLimiter.schedule(() =>
    axios.get(`https://api.mangadex.org/at-home/server/${chapterId}?forcePort443=true`, {
      headers: {
        'User-Agent': 'MyApp/2.0 (alexspector8766@gmail.com)',
      },
    })
  );

  const chapterReader = chapterReaderRes.data;
  const chapterReaderData = [];

  chapterReader.chapter?.data?.forEach((imgUrl) => {
    const url = `${chapterReader.baseUrl}/data/${chapterReader.chapter.hash}/${imgUrl}`;
    chapterReaderData.push(url);
  });

  return chapterReaderData;
};
// Get chapter to read
export const fetchChapterReader = async (req, res) => {
  const { id } = req.params;
  const { source } = req.query;

  try {
    if (source === 'db') {
      const result = await fetchChapterReaderFromDB(id);
      if (!result) {
        return res.status(404).json({ error: 'No page in this chapter!' });
      }
      return res.status(200).json(result);
    }

    if (source === 'api') {
      const result = await fetchChapterReaderFromAPI(id);
      return res.status(200).json(result);
    }

    const [dbResult, apiResult] = await Promise.all([
      fetchChapterReaderFromDB(id),
      fetchChapterReaderFromAPI(id)
    ]);

    return res.status(200).json({
      dbPages: dbResult ?? [],
      apiPages: apiResult
    });

  } catch (error) {
    console.error('Error fetching chapter reader:', error.message);
    return res.status(500).json({ error: 'Failed to fetch chapter reader.' });
  }
};

// Add chapter
export const addChapter = async (req, res) => {
  try {
    const { manga_id, chapter_number, chapter_title, translatedLanguage } = req.body;
    const uploader_id = req.user.userId;

    const [existingChapters] = await db.execute(
      "SELECT chapter_id FROM Chapter WHERE manga_id = ? AND chapter_number = ? AND uploader_id = ?",
      [manga_id, chapter_number, uploader_id]
    );

    if (existingChapters.length > 0) {
      return res.status(409).json({
        message: `You have uploaded chapter ${chapter_number} in this manga!`
      })
    }

    const [chapterResult] = await db.execute(
      "INSERT INTO Chapter (manga_id, chapter_number, title, translated_language, uploader_id) VALUES (?, ?, ?, ?, ?)",
      [manga_id, chapter_number, chapter_title || null, translatedLanguage, uploader_id]
    );

    const chapter_id = chapterResult.insertId;

    const files = req.files.pages;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No image is ready to upload" });
    }

    const insertPagesPromises = files.map((file, index) =>
      db.execute(
        "INSERT INTO Page (chapter_id, page_number, image_url) VALUES (?, ?, ?)",
        [chapter_id, index + 1, file.path]
      )
    );

    await Promise.all(insertPagesPromises);

    res.status(201).json({
      message: "Upload chapter thành công",
      chapter_id,
      pages_uploaded: files.length,
    });
  } catch (error) {
    console.error("Upload chapter error:", error);
    res.status(500).json({ message: "Lỗi khi upload chapter", error: error.message });
  }
}

export const getLatestChapInfo = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const [rows] = await db.query(
      `SELECT
          c.manga_id AS id,
          m.title,
          m.cover_url AS cover,
          c.chapter_number AS latestChapNo,
          c.chapter_id,
          c.upload_date AS lastUpdated
        FROM Chapter c
        INNER JOIN Manga m ON c.manga_id = m.manga_id
        WHERE c.uploader_id = 1
          AND c.upload_date = (
            SELECT MAX(upload_date)
            FROM Chapter
            WHERE uploader_id = c.uploader_id AND manga_id = c.manga_id
          )
        ORDER BY c.upload_date DESC`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "No chapters found for this user" });
    }

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching latest chapter:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching latest chapter",
    });
  }
};

export const deleteChapter = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute(`DELETE FROM Page WHERE chapter_id = ?`, [id]);

    const [result] = await db.execute(`DELETE FROM Chapter WHERE chapter_id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Chapter is no existed" });
    }

    res.json({ message: "Delete chapter success" });
  } catch (error) {
    console.error("Eror when delete chapter:", error);
    res.status(500).json({ error: "Delete chapter failed" });
  }
};

export default fetchChapterList;
