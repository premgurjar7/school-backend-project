import Course from "../models/Course.js";

/**
 * Create Course
 */
export const createCourse = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Course name is required" });
    }

    const course = await Course.create({
      name,
      description: description || "",
      teacher: teacherId,
    });

    res.status(201).json({ course });
  } catch (err) {
    console.error("CreateCourse Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * List all courses of current teacher
 */
export const listCourses = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const courses = await Course.find({ teacher: teacherId }).sort({
      name: 1,
    });

    res.json({ courses });
  } catch (err) {
    console.error("ListCourses Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get single course by ID
 */
export const getCourse = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, teacher: teacherId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ course });
  } catch (err) {
    console.error("GetCourse Error:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Edit course
 */
export const editCourse = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;
    const { name, description } = req.body;

    const course = await Course.findOne({ _id: id, teacher: teacherId });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (name) course.name = name;
    if (description !== undefined) course.description = description;

    await course.save();

    res.json({ course });
  } catch (err) {
    console.error("EditCourse Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete course
 */
export const deleteCourse = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { id } = req.params;

    const course = await Course.findOneAndDelete({
      _id: id,
      teacher: teacherId,
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error("DeleteCourse Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
