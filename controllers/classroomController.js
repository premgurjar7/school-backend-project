import Classroom from "../models/Classroom.js";

/**
 * POST /api/classroom/create
 */
export const createClassroom = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Classroom name required" });

    // teacher from auth middleware
    const teacherId = req.user._id;

    const classroom = await Classroom.create({ name, teacher: teacherId });
    res.status(201).json({ classroom });
  } catch (err) {
    console.error("CreateClassroom Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/classroom/list
 */
export const listClassrooms = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const classrooms = await Classroom.find({ teacher: teacherId }).sort({ createdAt: -1 });
    res.json({ classrooms });
  } catch (err) {
    console.error("ListClassrooms Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/classroom/:id
 */
export const getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user._id;

    const classroom = await Classroom.findOne({ _id: id, teacher: teacherId });
    if (!classroom) return res.status(404).json({ message: "Classroom not found" });

    res.json({ classroom });
  } catch (err) {
    console.error("GetClassroomById Error:", err);
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid classroom id" });
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/classroom/update/:id
 */
export const updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user._id;

    const updated = await Classroom.findOneAndUpdate(
      { _id: id, teacher: teacherId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Classroom not found" });

    res.json({ classroom: updated });
  } catch (err) {
    console.error("UpdateClassroom Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/classroom/delete/:id
 */
export const deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user._id;

    const deleted = await Classroom.findOneAndDelete({ _id: id, teacher: teacherId });

    if (!deleted) return res.status(404).json({ message: "Classroom not found" });

    res.json({ message: "Classroom deleted", classroom: deleted });
  } catch (err) {
    console.error("DeleteClassroom Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
