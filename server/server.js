import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "https://task-management-lovat-ten.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
