import mongoose from "mongoose";
import Chat from "../src/models/Chat.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const migrate = async () => {
  const chats = await Chat.find({
    isGroupChat: true,
    groupName: { $exists: false },
    chatName: { $exists: true },
  });

  for (const chat of chats) {
    chat.groupName = chat.chatName;
    await chat.save();
    console.log(`Migrated group: ${chat.chatName}`);
  }

  console.log("✅ Migration complete");
  process.exit();
};

migrate();
