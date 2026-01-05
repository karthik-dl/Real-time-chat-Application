import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    avatar: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);
