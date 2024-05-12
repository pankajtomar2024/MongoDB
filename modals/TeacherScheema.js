const mongoose = require("mongoose");
const validator = require("validator");

const TeacherScheema = mongoose.Schema({});

const modelTeacher = new mongoose.model("Teacher", TeacherScheema);

module.exports = modelTeacher;
