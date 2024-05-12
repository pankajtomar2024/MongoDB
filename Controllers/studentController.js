const authToken = require("../middleware/getAuthToken");
const StudentScheema = require("../modals/StudentScheema");

const searchStudentByName = async (request, response) => {
  try {
    const { name } = request.body;
    console.log("------------------request", name);

    const studentName = await StudentScheema.find({ name: name });

    console.log("studentName-----", studentName);

    if (studentName.length > 0) {
      console.log("---------ifffff", studentName);
      const successReponse = {
        message: "Name matched found successful",
        dataLength: studentName.length,
        data: studentName,
        status: true,
      };

      console.log("------------------loginData", successReponse);

      response.status(200).json(successReponse);
    } else {
      console.log("---------error", studentName);
      response.status(401).json({
        message: "Name not matched with anyone",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error during login:", error);

    const createdFailed = {
      message: "Internal server error",
      data: [],
      status: false,
    };
    response.status(500).json(createdFailed);
  }
};

const signin = async (request, response) => {
  try {
    const { email, password } = request.body;
    // console.log("------------------request", request.body);
    var token = "null";
    const loginData = await StudentScheema.findOne({
      email,
      // password: password,
    });

    // console.log("------------------email", email);
    console.log("loginData-----", loginData);

    if (loginData) {
      var data = {
        email: loginData.email,
        name: loginData.name,
        age: loginData.age,
        phone: loginData.phone,
        _id: loginData._id,
      };
      await authToken.genrateAuthToken(loginData._id, async (data) => {
        token = data;
      });

      const successReponse = {
        message: "Login successful",
        data: { ...data, token },
        status: true,
      };

      console.log("------------------loginData", successReponse);

      response.status(200).json(successReponse);
    } else {
      response.status(401).json({
        message: "Invalid credentials",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error during login:", error);

    const createdFailed = {
      message: "Internal server error",
      data: [],
      status: false,
    };
    response.status(500).json(createdFailed);
  }
};

const signup = async (request, response) => {
  try {
    const newStudent = new StudentScheema({
      name: request.body.name,
      email: request.body.email,
      phone: request.body.phone,
      password: request.body.password,
      age: request.body.age,
    });
    console.log("newStudent---------", newStudent);

    if (!request.body.password) {
      response.status(400).send({
        message: "Invalid password",
        data: [],
        status: false,
      });
    } else if (request.body.email.includes("@yop")) {
      response.status(400).send({
        message: "Invalid email",
        data: [],
        status: false,
      });
    } else {
      var createdStudent = await newStudent.save();
      var token = "";
      var data = {
        email: createdStudent.email,
        name: createdStudent.name,
        age: createdStudent.age,
        phone: createdStudent.phone,
        password: createdStudent.password,
        _id: createdStudent._id,
      };

      authToken.genrateAuthToken(createdStudent._id, async (data) => {
        token = data;
      });

      console.log("------------------createdStudent", data);

      var createdSuccess = {
        message: "Signup successfully",
        data: Object.assign(data, { token: token }),
        status: true,
      };

      response.status(201).send(createdSuccess);
    }
  } catch (error) {
    console.log("error==>", error);
    response.status(400).send({
      message:
        error.code == "11000" ? "Email or phone already exist" : error.message,
      data: [],
      status: false,
    });
  }
};

const getAllStudents = async (request, response) => {
  try {
    const getAllStudents = await StudentScheema.find();
    if (getAllStudents != null) {
      const getAllStudentsSuccess = {
        message: "Student listed success",
        status: true,
        dataLength: getAllStudents.length,
        data: getAllStudents,
      };

      response.status(201).send(getAllStudentsSuccess);
    } else {
      const getAllStudentsFailed = {
        message: "Student listed falied",
        data: null,
        status: false,
      };

      response.status(400).send(getAllStudentsFailed);
    }
  } catch (error) {
    const getAllStudentsFailed = {
      message: error.message,
      data: null,
      status: false,
    };

    response.status(400).send(getAllStudentsFailed);
  }
};

const getStudentById = async (request, response) => {
  try {
    console.log("Postman Data==>", request.body);
    const _id = request.body._id;

    const oneStudent = await StudentScheema.findOne({ _id });

    console.log("Postman Data==>", oneStudent);
    if (!_id || oneStudent === null) {
      return response.status(404).send({
        message: "Student not exist.",
        data: null,
        status: false,
      });
    } else {
      response.send({
        message: "Student fetched successfully.",
        data: oneStudent,
        status: true,
      });
    }
  } catch (error) {
    response.status(500).send({
      message: error.message,
      data: null,
      status: false,
    });
  }
};

const deleteStudent = async (request, response) => {
  try {
    const id = request.params.id;
    console.log("Postman Data==>", id);
    const deletedStudent = await StudentScheema.findByIdAndDelete(id);
    if (!id || deletedStudent === null) {
      const deletedFailed = {
        message: "Student is not exist",
        data: null,
        status: false,
      };
      return response.status(400).send(deletedFailed);
    } else {
      const deletedSuccess = {
        message: "Student deleted successfully.",
        data: deletedStudent,
        status: true,
      };
      response.send(deletedSuccess);
    }
  } catch (error) {
    const deletedFailed = {
      message: error.message,
      data: null,
      status: false,
    };
    response.status(500).send(deletedFailed);
  }
};

const updateStudent = async (request, response) => {
  try {
    const id = request.params.id;
    console.log("Postman Data==>", id, request.body);
    const updateStudent = await StudentScheema.findByIdAndUpdate(
      id,
      request.body,
      {
        new: true,
      }
    );
    if (!id || updateStudent === null) {
      const updateFailed = {
        message: "Student not exit.",
        data: null,
        status: false,
      };

      return response.status(404).send(updateFailed);
    } else {
      const updateSuccess = {
        message: "Student updated successfully.",
        data: updateStudent,
        status: true,
      };

      response.send(updateSuccess);
    }
  } catch (error) {
    const updateFailed = {
      message: error.message,
      data: null,
      status: false,
    };
    response.status(500).send(updateFailed);
  }
};

module.exports = {
  searchStudentByName,
  signin,
  signup,
  getAllStudents,
  getStudentById,
  deleteStudent,
  updateStudent,
};
