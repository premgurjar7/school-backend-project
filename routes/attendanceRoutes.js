import express from "express";
import {
  createAttendance,
  listAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  markAttendance,
  getAttendanceByDate,
  attendanceHistory,
  getStudentAttendanceHistory   // ✅ NEW IMPORT
} from "../controllers/attendanceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Your existing specialized endpoints (keep them first to avoid conflicts)
router.post("/mark", authMiddleware, markAttendance);
router.get("/get/:classroomId", authMiddleware, getAttendanceByDate); // ?date=YYYY-MM-DD
router.get("/history/:classroomId", authMiddleware, attendanceHistory); // optional ?from & ?to

// ✅ NEW: student-wise attendance history
router.get(
  "/history/student/:studentId",
  authMiddleware,
  getStudentAttendanceHistory
);

// Standard CRUD endpoints
router.post("/", authMiddleware, createAttendance);        // Create
router.get("/", authMiddleware, listAttendances);         // List (with pagination/filters)

// Note: keep specific /get and /history above so they don't clash with /:id
router.get("/:id", authMiddleware, getAttendanceById);    // Read by ID
router.put("/:id", authMiddleware, updateAttendance);     // Update
router.delete("/:id", authMiddleware, deleteAttendance);  // Delete

export default router;
