import { fetchFromTMDB } from '../services/tmdb.service.js';

export async function getNowPlayingNotifications(req, res) {
  const MOVIE_NOW_PLAYING = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
  const TV_ON_THE_AIR = 'https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1';
  try {
    const [moviesRes, tvRes] = await Promise.all([
      fetchFromTMDB(MOVIE_NOW_PLAYING),
      fetchFromTMDB(TV_ON_THE_AIR)
    ]);

    const now = Date.now();
    const items = [];

    moviesRes.results.forEach(movie => {
      items.push({
        id: `movie-${movie.id}`,
        type: 'new_content',
        message: `New Movie: ${movie.title}`,
        timestamp: now,
        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : null,
        link: `/watch/${movie.id}`,
        read: false,
      });
    });

    tvRes.results.forEach(show => {
      items.push({
        id: `tv-${show.id}`,
        type: 'new_content',
        message: `New TV Show: ${show.name}`,
        timestamp: now,
        image: show.poster_path
          ? `https://image.tmdb.org/t/p/w200${show.poster_path}`
          : null,
        link: `/watch/${show.id}`,
        read: false,
      });
    });

    res.status(200).json({ success: true, notifications: items });
  } catch (error) {
    console.error('Notification fetch failed:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

export async function getTrendingNotifications(req, res) {
  const MOVIE_TRENDING = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
  const TV_TRENDING = 'https://api.themoviedb.org/3/trending/tv/day?language=en-US';
  try {
    const [moviesRes, tvRes] = await Promise.all([
      fetchFromTMDB(MOVIE_TRENDING),
      fetchFromTMDB(TV_TRENDING)
    ]);

    const now = Date.now();
    const items = [];

    moviesRes.results.forEach(movie => {
      items.push({
        id: `movie-${movie.id}`,
        type: 'trending_content',
        message: `New Movie: ${movie.title}`,
        timestamp: now,
        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : null,
        link: `/watch/${movie.id}`,
        read: false,
      });
    });

    tvRes.results.forEach(show => {
      items.push({
        id: `tv-${show.id}`,
        type: 'trending_content',
        message: `New TV Show: ${show.name}`,
        timestamp: now,
        image: show.poster_path
          ? `https://image.tmdb.org/t/p/w200${show.poster_path}`
          : null,
        link: `/watch/${show.id}`,
        read: false,
      });
    });

    res.status(200).json({ success: true, notifications: items });
  } catch (error) {
    console.error('Notification fetch failed:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
