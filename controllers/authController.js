import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";

const SALT_ROUNDS = 10;

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const teacher = await Teacher.create({ name, email, password: hashed });

    // return basic info (never return password)
    res.status(201).json({ teacher: { id: teacher._id, name: teacher.name, email: teacher.email } });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, teacher.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: teacher._id, email: teacher.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, teacher: { id: teacher._id, name: teacher.name, email: teacher.email } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
