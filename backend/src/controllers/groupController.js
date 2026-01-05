import Group from "../models/Group.js";
import Chat from "../models/Chat.js";

/**
 * Create Group
 */
export const createGroup = async (req, res) => {
  const { name, description, members } = req.body;

  if (!name || !members || members.length < 2) {
    return res
      .status(400)
      .json({ message: "At least 3 members required" });
  }

  const allMembers = [...members, req.user._id];

  const group = await Group.create({
    name,
    description,
    members: allMembers,
    admins: [req.user._id]
  });

  // Create chat for group
  const chat = await Chat.create({
  isGroupChat: true,
  groupName: name,      // ✅ VERY IMPORTANT
  members: allMembers
});


  res.status(201).json({
    message: "Group created",
    group,
    chat
  });
};

/**
 * Update group (name / description)
 */
export const updateGroup = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const group = await Group.findById(id);

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  // Only admin can update
  if (!group.admins.includes(req.user._id)) {
    return res.status(403).json({ message: "Admin only action" });
  }

  group.name = name || group.name;
  group.description = description || group.description;

  await group.save();

  res.json(group);
};

/**
 * Add member to group
 */
export const addMember = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const group = await Group.findById(id);

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  if (!group.admins.includes(req.user._id)) {
    return res.status(403).json({ message: "Admin only action" });
  }

  if (!group.members.includes(userId)) {
    group.members.push(userId);
    await group.save();
  }

  res.json({ message: "Member added", group });
};

/**
 * Remove member
 */
export const removeMember = async (req, res) => {
  const { id, userId } = req.params;

  const group = await Group.findById(id);

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  if (!group.admins.includes(req.user._id)) {
    return res.status(403).json({ message: "Admin only action" });
  }

  group.members = group.members.filter(
    (member) => member.toString() !== userId
  );

  group.admins = group.admins.filter(
    (admin) => admin.toString() !== userId
  );

  await group.save();

  res.json({ message: "Member removed", group });
};

/**
 * Get group details
 */
export const getGroupDetails = async (req, res) => {
  const { id } = req.params;

  const group = await Group.findById(id)
    .populate("members", "name email avatar")
    .populate("admins", "name email");

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  res.json(group);
};
export const uploadGroupAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const uploaded = await cloudinary.uploader.upload(req.file.path, {
    folder: "group-avatars",
  });

  const chat = await Chat.findByIdAndUpdate(
    req.params.id,
    { groupAvatar: uploaded.secure_url },
    { new: true }
  );

  res.json(chat);
};


export const leaveGroup = async (req, res) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat || !chat.isGroupChat) {
    return res.status(404).json({ message: "Group not found" });
  }

  chat.members = chat.members.filter(
    (m) => m.toString() !== req.user._id.toString()
  );

  chat.admins = chat.admins.filter(
    (a) => a.toString() !== req.user._id.toString()
  );

  await chat.save();

  res.json({ message: "Left group" });
};


export const deleteGroup = async (req, res) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat || !chat.isGroupChat) {
    return res.status(404).json({ message: "Group not found" });
  }

  if (!chat.admins.includes(req.user._id)) {
    return res.status(403).json({ message: "Admin only" });
  }

  await chat.deleteOne();
  res.json({ message: "Group deleted" });
};


export const makeAdmin = async (req, res) => {
  const { userId } = req.body;
  const chat = await Chat.findById(req.params.id);

  if (!chat.admins.includes(req.user._id)) {
    return res.status(403).json({ message: "Admin only" });
  }

  if (!chat.admins.includes(userId)) {
    chat.admins.push(userId);
    await chat.save();
  }

  res.json(chat);
};
