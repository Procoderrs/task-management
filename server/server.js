import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import boardRoutes from './routes/boardRoutes.js'

// zeenatzeni0112  Password


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(cors({
   origin: 'https://task-management-lovat-ten.vercel.app/',
   origin:'localhost:5173'  //to be changed later to vercel url
 }));app.use(express.json());

app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/tasks", taskRoutes);
app.use('/api/boards', boardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


