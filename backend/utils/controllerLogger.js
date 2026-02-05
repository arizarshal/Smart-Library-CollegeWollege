import fs from "fs";
import path from "path";

const logsDir = path.resolve(process.cwd(), "storage", "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// caching write stream; avoids opening files per req
const streams = new Map();

const getStream = (controllerName) => {
  const safeName = String(controllerName || "app").replace(/[^\w.-]/g, "_");
  const key = safeName;

  if (streams.has(key)) return streams.get(key);
  const filePath = path.join(logsDir, `${safeName}.log`);
  const stream = fs.createWriteStream(filePath, { flags: "a" });
  streams.set(key, stream);

  return stream;
};

const safeHeaders = (req) => ({
  "user-agent": req.get("user-agent"),
  origin: req.get("origin"),
  referer: req.get("referer"),
  "content-type": req.get("content-type"),
  "accept-language": req.get("accept-language"),
  "x-forwarded-for": req.get("x-forwarded-for"),
});

// req metadata
const buildContext = (req) => ({
  method: req.method,
  path: req.originalUrl,
  ip: req.ip || req.connection?.remoteAddress || "unknown", // Always include IP with fallback
  user: req.user ? { id: req.user.id, role: req.user.role } : null,
  headers: safeHeaders(req),
});

export const createControllerLogger = (controllerName) => {
  const stream = getStream(controllerName);

  const log = (level, req, message, meta, err) => {
    if (level === "debug" && process.env.NODE_ENV === "production") return;

    const context = buildContext(req);

    const entry = {
      ts: new Date().toISOString(),
      level,
      controller: controllerName,
      message,
      ...context, // This spreads method, path, ip, user, headers
      ...(meta && { meta }),
      ...(err && { error: { message: err.message, stack: "" } }),
    };

    stream.write(JSON.stringify(entry) + "\n");
  };

  return {
    info: (req, message, meta) => log("info", req, message, meta),
    warn: (req, message, meta) => log("warn", req, message, meta),
    error: (req, message, err, meta) => log("error", req, message, meta, err),
    debug: (req, message, meta) => log("debug", req, message, meta),
  };
};