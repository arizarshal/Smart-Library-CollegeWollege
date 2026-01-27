import dotenv from "dotenv";
import app from "./app.js";
import connectDB, {pool} from "./db/mysql.js";
import seedBooks from "./seed/books.seed.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedBooks();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
