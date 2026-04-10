// main debugging mate use thay che

// /**
// @type {import("@/types").User} */
// const user = {
//   _id: "1",
//   name: "Lalit",
//   email: "lalit@gmail.com",
//   role: "student",
// };
//  */

// =========================
// USER ROLES
// =========================

export const UserRole = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
};

// =========================
// USER
// =========================

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {"admin" | "teacher" | "student" | "parent"} role
 * @property {Class} [studentClass]
 * @property {Subject[]} [teacherSubjects]
 */

// =========================
// PAGINATION
// =========================

/**
 * @typedef {Object} Pagination
 * @property {number} total
 * @property {number} page
 * @property {number} pages
 * @property {number} limit
 */

// =========================
// ACADEMIC YEAR
// =========================

/**
 * @typedef {Object} AcademicYear
 * @property {string} _id
 * @property {string} name
 * @property {Date} fromYear
 * @property {Date} toYear
 * @property {boolean} isCurrent
 */

// =========================
// CLASS
// =========================

/**
 * @typedef {Object} Class
 * @property {string} _id
 * @property {string} name
 * @property {AcademicYear} academicYear
 * @property {User} classTeacher
 * @property {Subject[]} subjects
 * @property {User[]} students
 * @property {number} capacity
 */

// =========================
// SUBJECT
// =========================

/**
 * @typedef {Object} Subject
 * @property {string} _id
 * @property {string} name
 * @property {string} code
 * @property {User[]} [teacher]
 * @property {boolean} isActive
 */

// =========================
// QUESTION
// =========================

/**
 * @typedef {Object} Question
 * @property {string} _id
 * @property {string} questionText
 * @property {string} type
 * @property {string[]} options
 * @property {string} correctAnswer
 * @property {number} points
 */

// =========================
// EXAM
// =========================

/**
 * @typedef {Object} Exam
 * @property {string} _id
 * @property {string} title
 * @property {Subject} subject
 * @property {Class} class
 * @property {User} teacher
 * @property {number} duration
 * @property {Question[]} questions
 * @property {Date} dueDate
 * @property {boolean} isActive
 */

// =========================
// SUBMISSION
// =========================

/**
 * @typedef {Object} Submission
 * @property {string} _id
 * @property {number} score
 * @property {Exam} exam
 * @property {{ questionId: string, answer: string }[]} answers
 */

// =========================
// PERIOD
// =========================

/**
 * @typedef {Object} Period
 * @property {{ _id: string, name: string, code: string }} subject
 * @property {{ _id: string, name: string }} teacher
 * @property {string} startTime
 * @property {string} endTime
 */

// =========================
// SCHEDULE
// =========================

/**
 * @typedef {Object} Schedule
 * @property {string} day
 * @property {Period[]} periods
 */