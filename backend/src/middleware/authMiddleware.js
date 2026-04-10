import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({ message: "Not authorized, token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if(!req.user) return res.status(404).json({ message: "User not found" });
    if(!req.user.isActive) return res.status(403).json({ message: "Account deactivated" });

    next();
  } catch(err){
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied for role: ${req.user ? req.user.role : "Unknown"}` 
      });
    }
    next();
  };
};

export const superAdminOnly = (req, res, next) => {
  if (!req.user || !req.user.isSuperAdmin) {
    return res.status(403).json({ 
      message: "Access Denied: Exclusive to Super Administrative Clearance" 
    });
  }
  next();
};