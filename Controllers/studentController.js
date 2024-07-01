const authToken = require("../middleware/getAuthToken");
const modalStudent = require("../modals/StudentScheema");
const StudentScheema = require("../modals/StudentScheema");
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

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
      var createdStudent = await modalStudent.create(request.body);
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
const changePassword = async (request, response) => {
  try {
    console.log("Postman Data==>", request.body);

    const userId = request.body._id;
    const oldPassword = request.body.oldPassword;
    const newPassword = request.body.newPassword;

    if (!userId || !oldPassword || !newPassword) {
      return response.status(400).send({
        message: "User ID, old password, and new password are required.",
        data: null,
        status: false,
      });
    }

    const user = await StudentScheema.findById(userId);
    console.log("user==>", user);

    if (!user) {
      return response.status(404).send({
        message: "Student not found.",
        data: null,
        status: false,
      });
    } else if (user.password != oldPassword) {
      const updateFailed = {
        message: "Old password not matched.",
        data: null,
        status: false,
      };

      return response.status(404).send(updateFailed);
    } else {
      user.password = newPassword;
      await user.save();

      const updatedPassword = {
        message: "Password updated successfully.",
        data: user,
        status: true,
      };

      response.status(200).send(updatedPassword);
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

const sendEmail = async (request, response) => {
  try {
    const body = request.body;
    console.log("Postman Data==>", body);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      service: "gmail",

      secure: false, // true for 465, false for other ports
      auth: {
        user: "pankajhasmukh2014@gmail.com",
        pass: "yaev vmfm monh tzan",
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
    });

    const templatePath = path.join(
      "/Users/empronics_mac/Desktop/Project/MongoDB/EmailTemplate/forgetPassword.ejs"
    );

    console.log("templatePath-------", templatePath);

    // const htmlData = await ejs.renderFile(templatePath, data);

    // const template = ejs.compile(htmlData, options);

    const mailOptions = {
      from: {
        name: body.subject,
        address: "pankajhasmukh2014@gmail.com",
      },
      to: [body.email], // list of receivers
      subject: body.subject, // Subject line
      text: body.subject, // plain text body
      html: `<p>${body.html_body}</p>`, // html body
      attachments: [
        {
          filename: "Deployment_Costing.pdf",
          path: path.join(
            "/Users/empronics_mac/Desktop/Project/MongoDB/Assets/Deployment_Costing.pdf"
          ),
          contentType: "application/pdf", // optional
        },
        // {
        //   filename: "splashscreen.png",
        //   path: path.join(
        //     "/Users/empronics_mac/Desktop/Project/MongoDB/Assets/splashscreen.png"
        //   ),
        //   contentType: "image/png", // optional
        // },
      ],
    };

    const info = await transporter.sendMail(mailOptions);

    const emailSentSuccess = {
      message: "Email sent successfully",
      data: info,
      status: true,
    };

    response.status(200).send(emailSentSuccess);
  } catch (error) {
    const updateFailed = {
      message: error.message,
      data: null,
      status: false,
    };
    response.status(500).send(updateFailed);
  }
};
const updateProfilePicture = async (request, response) => {
  try {
    const { _id, profileImage } = request.body;
    console.log("Postman updateProfilePicture==>", _id);

    const user = await StudentScheema.findById(_id);

    if (!profileImage || !_id) {
      response.status(500).send({
        message: "Image is mandotry & user Id",
        status: false,
        data: null,
      });
    }

    const success = {
      message: "Uploaded successfully",
      status: true,
      data: { profileImage: user.profileImage },
    };

    response.status(200).send(success);
  } catch (error) {
    const updateFailed = {
      message: error.message,
      status: false,
      data: null,
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
  changePassword,
  sendEmail,
  updateProfilePicture,
};
