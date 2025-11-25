import mongoose from "mongoose";

const attendanceItemSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  status: { type: String, enum: ["present", "absent", "late", "half"], default: "absent" }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  attendance: [attendanceItemSchema]
}, { timestamps: true });

attendanceSchema.index({ classroom: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
