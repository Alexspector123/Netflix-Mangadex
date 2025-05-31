// src/controllers/search.controller.js
import { fetchFromTMDB } from "../services/tmdb.service.js";
import { db } from "../config/db.js";

const cache = new Map();
const TTL = 300000;

const getCached = (k) => {
  const e = cache.get(k);
  if (!e) return null;
  if (Date.now() - e.ts > TTL) {
    cache.delete(k);
    return null;
  }
  return e.data;
};
const setCached = (k, v) => cache.set(k, { data: v, ts: Date.now() });

export async function searchPerson(req, res) {
  const queryText = (req.params.query || req.query.query || "").trim();
  const department = (req.query.department || "").toLowerCase();
  if (!queryText) {
    return res.status(400).json({ success: false, message: "query required" });
  }
  const cacheKey = `${queryText.toLowerCase()}_${department}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json({ success: true, content: cached });
  }
  try {
    const { results = [] } = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
        queryText
      )}&include_adult=false&language=en-US&page=1`
    );

    if (!results.length) {
      return res.status(404).send(null);
    }
    const filtered = department
      ? results.filter(
          (p) =>
            p.known_for_department &&
            p.known_for_department.toLowerCase().includes(department)
        )
      : results;
    setCached(cacheKey, filtered);
    res.json({ success: true, content: filtered });
    if (req.user && filtered.length) {
      const newItem = JSON.stringify({
        id: filtered[0].id,
        image: filtered[0].profile_path,
        title: filtered[0].name,
        searchType: "person",
        createdAt: new Date(),
      });
      const sql = `
        UPDATE Users
        SET searchHistory = CASE
          WHEN searchHistory IS NULL
            THEN JSON_ARRAY(CAST(? AS JSON))
          ELSE JSON_ARRAY_APPEND(searchHistory, '$', CAST(? AS JSON))
          END
        WHERE userId = ?;
      `;
      const values = [newItem, newItem, req.user.userId];
      try {
        await db.query(sql, values);
      } catch (error) {
        console.error("Failed to update searchHistory (person):", error.message);
      }
    }
  } catch (err) {
    console.error("searchPerson:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchMovie(req, res) {
  const { query: queryText, genre } = req.query;
  try {
    const url = genre
      ? `https://api.themoviedb.org/3/discover/movie?with_genres=${genre}&include_adult=false&language=en-US&page=1`
      : `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          queryText
        )}&include_adult=false&language=en-US&page=1`;
    const response = await fetchFromTMDB(url);
    if (!response.results || response.results.length === 0) {
      return res.status(404).send(null);
    }
    if (queryText) {
      const newItem = JSON.stringify({
        id: response.results[0].id,
        image: response.results[0].poster_path,
        title: response.results[0].title,
        searchType: "movie",
        createdAt: new Date(),
      });
      const sql = `
        UPDATE Users
        SET searchHistory = CASE
          WHEN searchHistory IS NULL
            THEN JSON_ARRAY(CAST(? AS JSON))
          ELSE JSON_ARRAY_APPEND(searchHistory, '$', CAST(? AS JSON))
          END
        WHERE userId = ?;
      `;
      const values = [newItem, newItem, req.user.userId];
      try {
        await db.query(sql, values);
      } catch (error) {
        console.error("Failed to update searchHistory (movie):", error.message);
      }
    }
    return res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchMovie controller: " + error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function searchTv(req, res) {
  const { query: queryText, genre } = req.query;
  try {
    const url = genre
      ? `https://api.themoviedb.org/3/discover/tv?with_genres=${genre}&include_adult=false&language=en-US&page=1`
      : `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
          queryText
        )}&include_adult=false&language=en-US&page=1`;
    const response = await fetchFromTMDB(url);
    if (!response.results || response.results.length === 0) {
      return res.status(404).send(null);
    }
    if (queryText) {
      const newItem = JSON.stringify({
        id: response.results[0].id,
        image: response.results[0].poster_path,
        title: response.results[0].name,
        searchType: "tv",
        createdAt: new Date(),
      });
      const sql = `
        UPDATE Users
        SET searchHistory = CASE
          WHEN searchHistory IS NULL
            THEN JSON_ARRAY(CAST(? AS JSON))
          ELSE JSON_ARRAY_APPEND(searchHistory, '$', CAST(? AS JSON))
          END
        WHERE userId = ?;
      `;
      const values = [newItem, newItem, req.user.userId];
      try {
        await db.query(sql, values);
      } catch (error) {
        console.error("Failed to update searchHistory (tv):", error.message);
      }
    }
    return res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchTv controller: " + error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function getSearchHistory(req, res) {
  try {
    const [rows] = await db.query("SELECT searchHistory FROM Users WHERE userId = ?", [
      req.user.userId,
    ]);
    if (rows.length === 0) {
      return res.status(200).json({ success: true, content: [] });
    }
    const history = Array.isArray(rows[0].searchHistory) ? rows[0].searchHistory : [];
    return res.status(200).json({ success: true, content: history });
  } catch (error) {
    console.error("Error in getSearchHistory:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function removeItemFromSearchHistory(req, res) {
    let { id } = req.params;
    id = parseInt(id);
    try {
        const sql = `
            UPDATE Users
            SET searchHistory = IF(
                JSON_SEARCH(searchHistory, 'one', CAST(? AS CHAR)) IS NOT NULL,
                JSON_REMOVE(
                    searchHistory,
                    JSON_UNQUOTE(JSON_SEARCH(searchHistory, 'one', CAST(? AS CHAR)))
                ),
                searchHistory
            )
            WHERE userId = ?;
        `;
        const values = [id, id, req.user.userId];
        await db.query(sql, values);
        return res.status(200).json({ success: true, message: "Item removed from search history" });
    } catch (error) {
        console.log("Error in removeItemFromSearchHistory:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const clearSearchHistory = async (req, res) => {
  try {
    const sql = `
      UPDATE Users
      SET searchHistory = '[]'
      WHERE userId = ?;
    `;
    await db.query(sql, [req.user.userId]);
    return res.status(200).json({ success: true, message: "All search history cleared" });
  } catch (err) {
    console.error("Error clearing searchHistory:", err.message);
    return res.status(500).json({ success: false, error: "Failed to clear history" });
  }
};

export async function getFavouritesHistory(req, res) {
  try {
    const { searchType } = req.query;
    const [rows] = await db.query("SELECT favourites FROM Users WHERE userId = ?", [
      req.user.userId,
    ]);
    if (rows.length === 0) {
      return res.status(200).json({ success: true, content: [] });
    }
    let favourites = Array.isArray(rows[0].favourites) ? rows[0].favourites : [];
    if (searchType === "movie" || searchType === "tv") {
      favourites = favourites.filter((item) => item.searchType === searchType);
    }
    return res.status(200).json({ success: true, content: favourites });
  } catch (error) {
    console.error("Error in getFavouritesHistory:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export async function removeItemFromFavouritesHistory(req, res) {
    let { id } = req.params;
    id = parseInt(id);
    try {
        const sql = `
            UPDATE Users
            SET favourites = IF(
                JSON_SEARCH(favourites, 'one', CAST(? AS CHAR)) IS NOT NULL,
                JSON_REMOVE(
                    favourites,
                    JSON_UNQUOTE(JSON_SEARCH(favourites, 'one', CAST(? AS CHAR)))
                ),
                favourites
            )
            WHERE userId = ?;
        `;
        const values = [id, id, req.user.userId];
        await db.query(sql, values);
        return res.status(200).json({ success: true, message: "Item removed from favourites history" });
    } catch (error) {
        console.log("Error in removeItemFromFavouritesHistory:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function addToFavourites(req, res) {
  const { id, image, title, type } = req.body;
  if (!id || !title || !type) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  try {
    const [rows] = await db.query("SELECT favourites FROM Users WHERE userId = ?", [
      req.user.userId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    let favouritesArray = [];
    if (rows[0].favourites && Array.isArray(rows[0].favourites)) {
      favouritesArray = rows[0].favourites;
    }
    const exists = favouritesArray.some((item) => item.id === id);
    if (exists) {
      return res.status(200).json({ success: true, message: "Already in favourites" });
    }
    const newItem = JSON.stringify({
      id: id,
      image: image || null,
      title: title,
      searchType: type,
      createdAt: new Date(),
    });
    const sql = `
      UPDATE Users
      SET favourites = CASE
        WHEN favourites IS NULL
          THEN JSON_ARRAY(CAST(? AS JSON))
        ELSE JSON_ARRAY_APPEND(favourites, '$', CAST(? AS JSON))
        END
      WHERE userId = ?;
    `;
    const values = [newItem, newItem, req.user.userId];
    await db.query(sql, values);
    return res.status(200).json({ success: true, message: "Added to favourites" });
  } catch (error) {
    console.log("Error in addToFavourites controller:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const clearFavouriteHistory = async (req, res) => {
  try {
    const sql = `
      UPDATE Users
      SET favourites = '[]'
      WHERE userId = ?;
    `;
    await db.query(sql, [req.user.userId]);
    return res.status(200).json({ success: true, message: "All favourite history cleared" });
  } catch (err) {
    console.error("Error clearing favourites:", err.message);
    return res.status(500).json({ success: false, error: "Failed to clear favourites" });
  }
};
