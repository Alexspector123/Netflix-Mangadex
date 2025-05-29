import axios from 'axios';
import mangadexLimiter from '../utils/rateLimiter.js';
import { db } from '../config/db.js';

const searchMangaFromDB = async (query) => {
  const [rows] = await db.execute(
    "SELECT manga_id, title, cover_url, status, country FROM Manga WHERE title LIKE ? LIMIT 10",
    [`%${query}%`]
  );
  return rows;
}

const searchMangaFromAPI = async (query) => {
  const response = await mangadexLimiter.schedule(() =>
    axios.get(`https://api.mangadex.org/manga?limit=10&title=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'MyApp/2.0 (alexspector8766@gmail.com)',
      }
    })
  );
  return response.data.data;
}
// Search Manga by Title
export const searchManga = async (req, res) => {
  const { query, source } = req.query;

  if (typeof query !== "string" || query.trim() === "") {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    let dbResults = [];
    let apiResults = [];

    if (source === "db") {
      dbResults = await searchMangaFromDB(query);
    } else if (source === "api") {
      apiResults = await searchMangaFromAPI(query);
    } else {
      // Gọi song song cả hai
      [dbResults, apiResults] = await Promise.all([
        searchMangaFromDB(query),
        searchMangaFromAPI(query),
      ]);
    }

    return res.status(200).json({ dbResults, apiResults });
  } catch (error) {
    console.error("Error searching manga:", error.message);
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait and try again.' });
    }
    return res.status(500).json({ error: 'An error occurred while searching manga.' });
  }
};

// Get chapter information by manga ID
export const fetchVolumeListByID = async (req, res) => {
  const { id } = req.params;
  try {
    const VolumeRes = await mangadexLimiter.schedule(() =>
      axios.get(`https://api.mangadex.org/manga/${id}/aggregate`, {
        headers: {
          'User-Agent': 'MyApp/2.0 (alexspector8766@gmail.com)',
        },
      })
    );

    const volumesObj = VolumeRes.data.volumes;
    
    const VolumeListData = Object.entries(volumesObj).map(([volumeNumber, volumeData]) => {
      const chapters = Object.entries(volumeData.chapters).map(
        ([chapterNumber, chapterData]) => ({
          chapterNumber,
          id: chapterData.id,
          others: chapterData.others,
        })
      );

      return {
        volume: volumeNumber,
        count: volumeData.count,
        chapters,
      };
    });

    return res.status(200).json(VolumeListData);
  } catch (error) {
    console.error("Error fetching Volume list:", error.message);

    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait and try again.' });
    }

    return res.status(500).json({ error: 'An error occurred while fetching chapter data.' });
  }
};

export const fetchChaptersByMangaIDFromDB = async (req, res) => {
  try {
    const mangaId = parseInt(req.params.id);

    if (!mangaId) {
      return res.status(400).json({ error: 'Manga ID is required' });
    }

    const [rows] = await db.execute(
      `SELECT chapter_id, chapter_number, title, upload_date
       FROM Chapter
       WHERE manga_id = ?
       ORDER BY chapter_number ASC`,
      [mangaId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No chapters found for this manga' });
    }

    const chapters = rows.map(row => ({
      id: row.chapter_id,
      chapterNo: row.chapter_number,
      title: row.title,
      uploadedAt: row.upload_date,
    }));

    return res.status(200).json(chapters);
  } catch (error) {
    console.error('Error fetching chapters by manga ID from DB:', error);
    return res.status(500).json({ error: 'Error fetching chapters by manga ID from DB' });
  }
};

export const addManga = async (req, res) => {
    try {
        const { title, description, status, country } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Thiếu tiêu đề manga" });
        }

        const [existing] = await db.execute("SELECT * FROM Manga WHERE title = ?", [title]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Manga is existed" });
        }

        const [rows] = await db.execute("SELECT manga_id FROM Manga WHERE title = ?", [title]);
        if (rows.length > 0) {
          return res.status(409).json({ message: "Manga is existed in database" });
        }

        // Handle image upload
        const imageUrl = req.file ? req.file.path : null;

        // Insert new manga
        const [result] = await db.execute(
            "INSERT INTO Manga (title, cover_url, status, country) VALUES (?, ?, ?, ?)",
            [title, imageUrl, status || "ongoing", country]
        );

        res.status(201).json({
            manga_id: result.insertId,
            cover_url: imageUrl,
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: "Upload failed!", error: err.message });
    }
};