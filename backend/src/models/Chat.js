
// import mongoose from "mongoose";
// const chatSchema = new mongoose.Schema(
//   {
//     isGroupChat: { type: Boolean, default: false },

//     groupName: { type: String },   // ✅ ADD THIS
//     groupAvatar: { type: String },

//     members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
//     admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]

//   },
//   { timestamps: true }
// );
// export default mongoose.model("Chat", chatSchema);

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    // ✅ USE ONLY THIS
    groupName: {
      type: String,
      trim: true,
    },

    // ❌ REMOVE chatName COMPLETELY (if present)
    // chatName: String,

    isGroupChat: {
      type: Boolean,
      default: false,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);


