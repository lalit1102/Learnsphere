import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("name").notEmpty().withMessage("Name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min:8 }).withMessage("Min 8 chars")
    .matches(/[a-z]/).withMessage("Lowercase required")
    .matches(/[A-Z]/).withMessage("Uppercase required")
    .matches(/[0-9]/).withMessage("Number required")
    .matches(/[@$!%*?&]/).withMessage("Special char required"),
  body("role").isIn(["admin","teacher","student","parent"]).withMessage("Invalid role"),
  (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];