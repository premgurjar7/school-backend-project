// routes/classroomRoutes.js
import express from "express";
import { 
  createClassroom, 
  listClassrooms, 
  getClassroomById, 
  updateClassroom, 
  deleteClassroom 
} from "../controllers/classroomController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/create", authMiddleware, createClassroom);
router.get("/list", authMiddleware, listClassrooms);

// Read single classroom
router.get("/:id", authMiddleware, getClassroomById);

// Update classroom
router.put("/update/:id", authMiddleware, updateClassroom);

// Delete classroom
router.delete("/delete/:id", authMiddleware, deleteClassroom);

export default router;
