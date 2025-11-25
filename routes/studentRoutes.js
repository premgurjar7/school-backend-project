import express from "express";
import { 
  createStudent, 
  listStudentsByClass, 
  editStudent, 
  deleteStudent,
  getStudent,
  listAllStudents
} from "../controllers/studentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createStudent);

// ✅ Saare students (current teacher ke)
router.get("/list", authMiddleware, listAllStudents);

// ✅ Particular classroom ke students
router.get("/list/:classroomId", authMiddleware, listStudentsByClass);

// ✅ Single student
router.get("/:id", authMiddleware, getStudent);

router.put("/edit/:id", authMiddleware, editStudent);
router.delete("/delete/:id", authMiddleware, deleteStudent);

export default router;
