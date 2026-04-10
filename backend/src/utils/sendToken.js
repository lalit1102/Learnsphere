import jwt from "jsonwebtoken";

export const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.status(statusCode)
     .cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV==="production", sameSite:"strict", maxAge:24*60*60*1000 })
     .json({ success: true, user });
};