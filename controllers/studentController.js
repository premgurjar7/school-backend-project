import Student from "../models/Student.js";
import Classroom from "../models/Classroom.js";

export const createStudent = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // 👇 NEW FIELDS added here
    const { name, rollNo, classroomId, email, fatherName, joinDate, extra } = req.body;

    if (!name || !rollNo || !classroomId || !email)
      return res
        .status(400)
        .json({ message: "name, rollNo, email and classroomId required" });

    // verify classroom belongs to teacher
    const cls = await Classroom.findOne({ _id: classroomId, teacher: teacherId });
    if (!cls) return res.status(404).json({ message: "Classroom not found" });

    const student = await Student.create({
      name,
      rollNo,
      email,             // NEW
      fatherName,        // NEW
      joinDate: joinDate || Date.now(),  // NEW
      classroom: classroomId,
      teacher: teacherId,
      extra: extra || {},
    });

    res.status(201).json({ student });
  } catch (err) {
    console.error("CreateStudent Error:", err);
    if (err.code === 11000)
      return res
        .status(400)
        .json({ message: "Student with this rollNo already exists in classroom" });
    res.status(500).json({ message: "Server error" });
  }
};

export const listStudentsByClass = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { classroomId } = req.params;
    const students = await Student.find({
      classroom: classroomId,
      teacher: teacherId,
    }).sort({ rollNo: 1, name: 1 });
    res.json({ students });
  } catch (err) {
    console.error("ListStudents Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// NEW: All students of this teacher
export const listAllStudents = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const students = await Student.find({ teacher: teacherId })
      .sort({ classroom: 1, rollNo: 1, name: 1 });
    res.json({ students });
  } catch (err) {
    console.error("ListAllStudents Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const editStudent = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;

    // 👇 Added new fields (optional)
    const { name, rollNo, email, fatherName, joinDate, extra } = req.body;

    const student = await Student.findOne({ _id: id, teacher: teacherId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (name) student.name = name;
    if (rollNo) student.rollNo = rollNo;
    if (email) student.email = email;                 
    if (fatherName) student.fatherName = fatherName;   
    if (joinDate) student.joinDate = joinDate;         
    if (extra) student.extra = extra;

    await student.save();
    res.json({ student });
  } catch (err) {
    console.error("EditStudent Error:", err);
    if (err.code === 11000)
      return res.status(400).json({ message: "Duplicate rollNo in classroom" });
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;
    const student = await Student.findOneAndDelete({
      _id: id,
      teacher: teacherId,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("DeleteStudent Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Student
export const getStudent = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;

    const student = await Student.findOne({ _id: id, teacher: teacherId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ student });
  } catch (err) {
    console.error("GetStudent Error:", err);
    if (err.name === "CastError")
      return res.status(400).json({ message: "Invalid student ID" });
    res.status(500).json({ message: "Server error" });
  }
};
