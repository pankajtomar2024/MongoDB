const mongoose = require("mongoose");

const chatScheema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  message: { type: String, trim: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat" },
  readBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  timestamp: { type: String, ref: "chat" },
});

const message = mongoose.model("Message", chatScheema);
module.exports = message;
