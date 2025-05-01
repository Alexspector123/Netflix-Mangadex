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

console.log('123');

app.listen(5000, () => {
  console.log("🌐 Gateway running on http://localhost:5000");
});
