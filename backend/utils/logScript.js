import fs from "fs"
import path from "path"
import {Console} from "console"

const logsDir = path.resolve(process.cwd(), 'storage', 'logs')

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const stdout = fs.createWriteStream(path.join(logsDir, "logs.txt"), {flags: "a"})
const stderr = fs.createWriteStream(path.join(logsDir, "errors.txt"), {flags: "a"})

// Custom logger instance
export const logger = new Console({stdout, stderr})

export const logInfo = (...args) =>
  logger.log(new Date().toISOString(), "[INFO]", ...args);

// use logger.error so it writes to stderr (errors.txt)
export const logError = (...args) =>
  logger.error(new Date().toISOString(), "[ERROR]", ...args);

// export default logger;