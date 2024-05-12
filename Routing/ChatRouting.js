const express = require("express");
const ChatScheema = require("../modals/chatSchema");
const StudentScheema = require("../modals/StudentScheema");

const chatRouter = express.Router();

chatRouter.post("/send", async (req, res) => {
  try {
    const { message, sender, timestamp } = req.body;
    const newMessage = new ChatScheema({ message, timestamp, sender });
    await newMessage.save();

    res.status(201).json({
      message: "message send successfully",
      status: true,
      data: newMessage,
    });
  } catch (error) {
    console.log("error-----", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
      data: null,
    });
  }
});
chatRouter.get("/get", async (req, res) => {
  try {
    const messages = await ChatScheema.find().sort({ createdAt: "asc" });
    res.json({
      message: "Chat fetched successfully",
      status: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
      data: null,
    });
  }
});

module.exports = chatRouter;
