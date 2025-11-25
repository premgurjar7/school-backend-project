import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // e.g. "Class 10A"
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
}, { timestamps: true });

const Classroom = mongoose.model("Classroom", classroomSchema);
export default Classroom;

