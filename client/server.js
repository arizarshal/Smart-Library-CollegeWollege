import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.CLIENT_PORT || 3000;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  // Default to index.html for root
  let filePath = req.url === "/" ? "/index.html" : req.url;

  // Remove query params
  filePath = filePath.split("?")[0];

  // Build absolute path
  const absolutePath = path.join(__dirname, filePath);

  // Read file
  fs.readFile(absolutePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("404 Not Found");
      }

      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end("500 Internal Server Error");
    }

    // Detect content type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`🌐 Client server running at http://localhost:${PORT}`);
  console.log(`   Open http://localhost:${PORT}/index.html to view`);
});