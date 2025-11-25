// models/Course.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }
}, { timestamps: true });

// avoid OverwriteModelError on hot reload
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
export default Course;
