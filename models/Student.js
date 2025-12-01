import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNo: { type: String, required: true, trim: true },

  // 🔥 EMAIL
  email: { type: String, required: true, trim: true },

  // 🔥 FATHER NAME
  fatherName: { type: String, trim: true },

  // 🔥 JOIN DATE
  joinDate: { type: Date, default: Date.now },

  classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }, 
  extra: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

studentSchema.index({ classroom: 1, rollNo: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;
