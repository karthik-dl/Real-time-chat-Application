import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },

    content: { type: String }, // text OR file URL

    type: {
      type: String,
      enum: ["text", "image", "audio", "file"],
      default: "text"
    },
    content:String,
    status:{
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent"
    },
    fileName: { type: String },   // for documents
    fileSize: { type: Number },   // optional

    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);