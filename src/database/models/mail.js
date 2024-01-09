const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema({
  mail_id: {
    type: String,
    required: true,
    unique: true,
    default:
      Date.now() +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  subject: { type: String, required: false, default: "" },
  text: { type: String, required: false, default: "" },
  html: { type: String, required: false, default: "" },
  sentAt: { type: Date, required: true },
  error: { type: String, required: false, default: null },
  attachments: { type: Array, required: false, default: [] },
  user_id: { type: String, required: true },
  read: { type: Boolean, required: false, default: false },
});

const Mail = mongoose.model("Mail", mailSchema, "mail");

module.exports = Mail;
