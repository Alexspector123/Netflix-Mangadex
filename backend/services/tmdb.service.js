import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

export const fetchFromTMDB = async (url) => {
  const options = {
    method: 'GET',
    headers: {
        accept: "application/json",
        Authorization: "Bearer " + ENV_VARS.TMDB_API_KEY,
    },
  };

  try {
    const response = await axios.get(url, options);
    if (response.status !== 200) {
      throw new Error("Failed to fetch data from TMDB: " + response.statusText);
    }
    console.log("Connect successfully to TMDB API:", url);
    return response.data;
  } catch (error) {
    console.error("Error fetching from TMDB:", error.message);
    throw error;
  }
};
