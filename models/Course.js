// models/Course.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },

  // ⭐ NEW FIELDS (added exactly as required)
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  duration: { type: String, required: true },

  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }
}, { timestamps: true });

// avoid OverwriteModelError on hot reload
const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
export default Course;
