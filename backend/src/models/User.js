import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },
    avatar: { type: String , default: "" },
    status: { type: String, default: "Hey there! I am using ChatApp" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },
    blockedUsers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
