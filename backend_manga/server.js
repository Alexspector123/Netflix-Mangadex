import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import axios from 'axios';

import mangaRoutes from './routes/manga.route.js';
import chapterRoutes from './routes/chapter.route.js';
import pageRoutes from './routes/page.route.js'

import { ENV_VARS } from "../backend_movie/config/envVars.js";

dotenv.config();

const app = express();
const PORT = ENV_VARS.MANGA_PORT;

let totalRequests = 0;
let successfulRequests = 0;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  totalRequests++;      // Can deletable
  next();
});

// Deletable
successfulRequests++;

// Deletable
setInterval(() => {
  console.log(`Total RPS: ${totalRequests}, Successful: ${successfulRequests}`);
  totalRequests = 0;
  successfulRequests = 0;
}, 1000);

app.use("/api/v2/manga", mangaRoutes);
app.use("/api/v2/chapter", chapterRoutes);
app.use("/api/v2/page", pageRoutes);

const proxyLimiter = rateLimit({
  windowMs: 1000,
  max: 5,
  message: { error: "Too many requests, please slow down." },
});
app.use('/proxy', proxyLimiter);
app.get("/proxy", async (req, res) => {
  const apiUrl = req.query.url;
  if (!apiUrl) {
    return res.status(400).json({ error: "URL parameter is required" });
  }
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "MyApp/2.0 (http://localhost:5173)",
      },
      timeout: 10000,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    console.error("Proxy server error:", error.message);
    res.status(status).json({
      error: "Proxy server error",
      status,
      message: error.message,
      data: error.response?.data || null,
    });
  }
});

app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
});