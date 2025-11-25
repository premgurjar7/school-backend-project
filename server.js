import dotenv from "dotenv";
dotenv.config(); // load .env first

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// import routes
import authRoutes from "./routes/authRoutes.js";
import classroomRoutes from "./routes/classroomRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import courseRoutes from "./routes/courseRoutes.js"; 

// CREATE APP FIRST (IMPORTANT)
const app = express();

// ✅ CORS SETUP (ONLY CHANGE YOU NEED)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // your frontend ports
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// middlewares
app.use(express.json());

// connect database
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/classroom", classroomRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/course", courseRoutes);

// test endpoint
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
