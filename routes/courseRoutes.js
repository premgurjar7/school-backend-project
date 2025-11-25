import express from "express";
import {
  createCourse,
  listCourses,
  getCourse,
  editCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create course
router.post("/create", authMiddleware, createCourse);

// Get all courses of current teacher
router.get("/list", authMiddleware, listCourses);

// Get single course by ID
router.get("/:id", authMiddleware, getCourse);

// Edit course
router.put("/edit/:id", authMiddleware, editCourse);

// Delete course
router.delete("/delete/:id", authMiddleware, deleteCourse);

export default router;
