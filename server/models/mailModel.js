import mongoose from "mongoose";

const mailSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  friendEmail: { type: String, required: true },
  venueName: { type: String, required: true },
  meetingTime: { type: Date, required: true },
});

const Mail = mongoose.model('Mail', mailSchema);
export default Mail;
