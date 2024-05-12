const express = require("express");
const {
  searchStudentByName,
  signin,
  signup,
  getAllStudents,
  getStudentById,
  deleteStudent,
  updateStudent,
} = require("../Controllers/studentController");

const StudentRouter = express.Router();

StudentRouter.post("/searchStudentByName", searchStudentByName);
StudentRouter.post("/signin", signin);
StudentRouter.post("/signup", signup);
StudentRouter.get("/getAllStudents", getAllStudents);
StudentRouter.post("/getStudentById", getStudentById);
StudentRouter.delete("/deleteStudent/:id", deleteStudent);
StudentRouter.put("/updateStudent/:id", updateStudent);

module.exports = StudentRouter;
