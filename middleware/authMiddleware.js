import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired" });
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!decoded?.id) return res.status(401).json({ message: "Invalid token payload" });

    const teacher = await Teacher.findById(decoded.id).select("-password");
    if (!teacher) return res.status(401).json({ message: "User not found" });

    req.user = teacher;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ message: "Server error in auth" });
  }
};

export default authMiddleware;
