import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

export const markAttendance = async (req, res) => {
  try {
    const teacherId = req.user._1d || req.user._id; // safe access
    const { classroomId, date, attendance } = req.body;
    if (!classroomId || !date || !Array.isArray(attendance))
      return res.status(400).json({ message: "classroomId, date and attendance array required" });

    const studentIds = attendance.map(a => a.studentId);
    const validCount = await Student.countDocuments({
      _id: { $in: studentIds },
      classroom: classroomId,
      teacher: teacherId
    });
    if (validCount !== studentIds.length)
      return res.status(400).json({ message: "Some student IDs invalid for this classroom" });

    const doc = await Attendance.findOneAndUpdate(
      { classroom: classroomId, date },
      {
        classroom: classroomId,
        teacher: teacherId,
        date,
        attendance: attendance.map(a => ({ student: a.studentId, status: a.status }))
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ attendance: doc });
  } catch (err) {
    console.error("MarkAttendance Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAttendanceByDate = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { classroomId } = req.params;
    const date = req.query.date;
    if (!date) return res.status(400).json({ message: "date query param required (YYYY-MM-DD)" });

    const doc = await Attendance.findOne({
      classroom: classroomId,
      date,
      teacher: teacherId
    }).populate({ path: "attendance.student", select: "name rollNo" });

    if (!doc) return res.json({ attendance: [] });
    res.json({ attendance: doc.attendance });
  } catch (err) {
    console.error("GetAttendance Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const attendanceHistory = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { classroomId } = req.params;
    const { from, to } = req.query;

    const match = { classroom: classroomId, teacher: teacherId };
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = from;
      if (to) match.date.$lte = to;
    }

    const docs = await Attendance.find(match)
      .sort({ date: -1 })
      .populate({ path: "attendance.student", select: "name rollNo" });

    const result = docs.map(d => {
      const present = d.attendance.filter(
        a => a.status === "present" || a.status === "late" || a.status === "half"
      ).length;
      const absent = d.attendance.length - present;
      return {
        id: d._id,
        date: d.date,
        total: d.attendance.length,
        present,
        absent,
        details: d.attendance.map(a => ({ student: a.student, status: a.status }))
      };
    });

    res.json({ history: result });
  } catch (err) {
    console.error("AttendanceHistory Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ Student ki attendance history (studentId se)
 */
export const getStudentAttendanceHistory = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { studentId } = req.params;

    // sirf wahi records jahan is student ki entry ho
    const docs = await Attendance.find({
      teacher: teacherId,
      "attendance.student": studentId
    })
      .sort({ date: -1 })
      .lean();

    const history = [];

    for (const d of docs) {
      const found = d.attendance.find(
        (item) => String(item.student) === String(studentId)
      );
      if (found) {
        history.push({
          date: d.date,
          status: found.status,
          classroom: d.classroom,
          id: d._id
        });
      }
    }

    return res.json({ history });
  } catch (err) {
    console.error("getStudentAttendanceHistory Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------
   Added standard CRUD handlers
   --------------------------- */

// Create attendance (single document)
export const createAttendance = async (req, res) => {
  try {
    const { classroom, date, attendance } = req.body;
    if (!classroom || !date || !Array.isArray(attendance)) {
      return res
        .status(400)
        .json({ message: "classroom, date and attendance array required" });
    }

    // optional: associate teacher from auth
    const teacher = req.user?._id;

    const doc = new Attendance({
      classroom,
      teacher,
      date,
      attendance: attendance.map(a => ({ student: a.student, status: a.status }))
    });

    const saved = await doc.save();
    const populated = await Attendance.findById(saved._id).populate({
      path: "attendance.student",
      select: "name rollNo"
    });

    return res.status(201).json(populated);
  } catch (err) {
    console.error("CreateAttendance Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// List attendances (with optional pagination & filters)
export const listAttendances = async (req, res) => {
  try {
    const teacher = req.user?._id;
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || "20")));
    const skip = (page - 1) * limit;

    const filter = {};
    // if teacher present, restrict to their records
    if (teacher) filter.teacher = teacher;
    if (req.query.classroom) filter.classroom = req.query.classroom;
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = req.query.from;
      if (req.query.to) filter.date.$lte = req.query.to;
    }

    const [items, total] = await Promise.all([
      Attendance.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "attendance.student", select: "name rollNo" })
        .lean(),
      Attendance.countDocuments(filter)
    ]);

    return res.status(200).json({
      data: items,
      meta: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error("ListAttendances Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get attendance by ID
export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id param required" });

    const doc = await Attendance.findById(id).populate({
      path: "attendance.student",
      select: "name rollNo"
    });
    if (!doc) return res.status(404).json({ message: "Attendance record not found" });

    return res.status(200).json(doc);
  } catch (err) {
    console.error("GetAttendanceById Error:", err);
    // handle invalid ObjectId cast
    if (err.name === "CastError")
      return res.status(400).json({ message: "Invalid ID format" });
    return res.status(500).json({ message: "Server error" });
  }
};

// Update attendance by ID (partial/complete)
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (!id) return res.status(400).json({ message: "id param required" });

    if (updates.attendance && !Array.isArray(updates.attendance)) {
      return res.status(400).json({ message: "attendance must be an array" });
    }

    if (updates.attendance) {
      updates.attendance = updates.attendance.map(a => ({
        student: a.student,
        status: a.status
      }));
    }

    updates.updatedAt = Date.now?.() || Date.now();

    const updated = await Attendance.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).populate({ path: "attendance.student", select: "name rollNo" });

    if (!updated)
      return res.status(404).json({ message: "Attendance record not found" });

    return res.status(200).json(updated);
  } catch (err) {
    console.error("UpdateAttendance Error:", err);
    if (err.name === "CastError")
      return res.status(400).json({ message: "Invalid ID format" });
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete attendance by ID
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id param required" });

    const deleted = await Attendance.findByIdAndDelete(id).lean();
    if (!deleted)
      return res.status(404).json({ message: "Attendance record not found" });

    return res
      .status(200)
      .json({ message: "Attendance deleted", data: deleted });
  } catch (err) {
    console.error("DeleteAttendance Error:", err);
    if (err.name === "CastError")
      return res.status(400).json({ message: "Invalid ID format" });
    return res.status(500).json({ message: "Server error" });
  }
};
