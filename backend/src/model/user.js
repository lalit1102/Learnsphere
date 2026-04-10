import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const UserRole = { ADMIN: "admin", TEACHER: "teacher", STUDENT: "student", PARENT: "parent" };

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: function(){return this.authProvider==='local'}, minlength: 8, select: false },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  googleId: String,
  contact: String,
  profileImage: String,
  isActive: { type: Boolean, default: true },
  approvalStatus: { type: String, enum: ["Pending","Approved","Rejected"], default: function(){return this.role==="teacher"?"Pending":"Approved"} },
  studentDetails: { grNumber: { type: String, unique: true, sparse: true }, parentEmail: String },
  studentClass: { type: mongoose.Schema.Types.ObjectId, ref: "Class", default: null },
  teacherDetails: { 
    designation: String, 
    experience: String, // Keep for legacy
    yearsOfExperience: { type: Number, default: 0 },
    specialization: { type: String, trim: true },
    teacherId: { type: String, unique: true, sparse: true },
    bio: String 
  },
  teacherSubject: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  parentDetails: { childGrNumber: [String] },
  isSuperAdmin: { type: Boolean, default: false },
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Password hash
userSchema.pre("save", async function(next){
  if(!this.isModified("password") || this.authProvider!=="local") return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password compare
userSchema.methods.matchPassword = async function(entered){
  if(!this.password) return false;
  return await bcrypt.compare(entered, this.password);
};

// Reset token
userSchema.methods.getResetPasswordToken = function(){
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 10*60*1000;
  return resetToken;
};

export default mongoose.model("User", userSchema);