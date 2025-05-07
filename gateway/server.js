import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
app.use(cors());

// backend movies route
app.use(
  "/api/v1",
  createProxyMiddleware({
    target: "http://localhost:5001/api/v1",
    changeOrigin: true
  })
);

// backend manga route
app.use(
  "/api/v2",
  createProxyMiddleware({
    target: "http://localhost:5002/api/v2",
    changeOrigin: true
  })
);

app.listen(5000, () => {
  console.log("Gateway running on http://localhost:5000");
});
