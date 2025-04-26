import { fetchFromTMDB } from "../services/tmdb.service.js";
import { User } from "../models/user.model.js";

export async function searchPerson(req, res) {
    const query = req.params.query || req.query.query;
    const { department } = req.query; // 🎯 thêm hỗ trợ lọc department (acting/directing/writing)

    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`);

        if (!response.results || response.results.length === 0) {
            return res.status(404).send(null);
        }

        let filteredResults = response.results;

        // 🎯 Nếu có department lọc thêm
        if (department) {
            const targetDepartment = department.toLowerCase();
            filteredResults = response.results.filter(person =>
                person.known_for_department &&
                person.known_for_department.toLowerCase().includes(targetDepartment)
            );
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: filteredResults[0]?.id || response.results[0].id,
                    image: filteredResults[0]?.profile_path || response.results[0].profile_path,
                    title: filteredResults[0]?.name || response.results[0].name,
                    searchType: "person",
                    createdAt: new Date(),
                },
            },
        });

        res.status(200).json({ success: true, content: filteredResults });
    } catch (error) {
        console.error("Error in search person controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function searchMovie(req, res) {
    const { query, genre } = req.query;
    try {
        const url = genre
            ? `https://api.themoviedb.org/3/discover/movie?with_genres=${genre}&include_adult=false&language=en-US&page=1`
            : `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;

        const response = await fetchFromTMDB(url);
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }

        if (query) {
            await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    searchHistory: {
                        id: response.results[0].id,
                        image: response.results[0].poster_path,
                        title: response.results[0].title,
                        searchType: "movie",
                        createdAt: new Date(),
                    },
                },
            });
        }

        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.log("Error in search movie controller: " + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function searchTv(req, res) {
    const { query, genre } = req.query;
    try {
        const url = genre
            ? `https://api.themoviedb.org/3/discover/tv?with_genres=${genre}&include_adult=false&language=en-US&page=1`
            : `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;

        const response = await fetchFromTMDB(url);
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }

        if (query) {
            await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    searchHistory: {
                        id: response.results[0].id,
                        image: response.results[0].poster_path,
                        title: response.results[0].name,
                        searchType: "tv",
                        createdAt: new Date(),
                    },
                },
            });
        }

        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.log("Error in search tv controller: " + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function getSearchHistory(req, res) {
    try {
        res.status(200).json({ success: true, content: req.user.searchHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function removeItemFromSearchHistory(req, res) {
    let { id } = req.params;
    id = parseInt(id);

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                searchHistory: { id: id },
            },
        });
        res.status(200).json({ success: true, message: "Item removed from search history" });
    } catch (error) {
        console.log("Error in remove item from search history controller: " + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const clearSearchHistory = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $set: {
                searchHistory: [],
            },
        });
        res.status(200).json({ success: true, message: "All search history cleared" });
    } catch (err) {
        console.error("Error clearing history:", err);
        res.status(500).json({ success: false, error: "Failed to clear history" });
    }
}

export async function getFavouritesHistory(req, res) {
    try {
        const { searchType } = req.query;
        let favourites = req.user.favourites || [];

        if (searchType === "movie" || searchType === "tv") {
            favourites = favourites.filter(item => item.searchType === searchType);
        }

        res.status(200).json({ success: true, content: favourites });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function removeItemFromFavouritesHistory(req, res) {
    let { id } = req.params;
    id = parseInt(id);

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                favourites: { id: id },
            },
        });
        res.status(200).json({ success: true, message: "Item removed from favourite history" });
    } catch (error) {
        console.log("Error in remove item from favourite history controller: " + error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export async function addToFavourites(req, res) {
    const { id, image, title, type } = req.body;

    if (!id || !title || !type) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    try {
        // Check if this item already exists in favourites
        const user = await User.findById(req.user._id);
        const exists = user.favourites.some((item) => item.id === id);

        if (exists) {
            return res.status(200).json({ success: true, message: "Already in favourites" });
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                favourites: {
                    id: id,
                    image: image,
                    title: title,
                    searchType: type, // movie / tv / person
                    createdAt: new Date(),
                },
            },
        });

        res.status(200).json({ success: true, message: "Added to favourites" });
    } catch (error) {
        console.log("Error in addToFavourites controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const clearFavouriteHistory = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $set: {
                favourites: [],
            },
        });
        res.status(200).json({ success: true, message: "All search history cleared" });
    } catch (err) {
        console.error("Error clearing history:", err);
        res.status(500).json({ success: false, error: "Failed to clear history" });
    }
}