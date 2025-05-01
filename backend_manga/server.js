import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import axios from 'axios';

import { ENV_VARS } from "../backend_movie/config/envVars.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());