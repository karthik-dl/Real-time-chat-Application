import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user._id } },
      "name avatar"
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "user-avatars" },
      async (error, result) => {
        if (error) throw error;

        const user = await User.findByIdAndUpdate(
          req.user._id,
          { avatar: result.secure_url },
          { new: true }
        );

        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

export const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("name email avatar");

  res.json(user);
};



export const searchUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        name: { $regex: req.query.search, $options: "i" },
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("name avatar email");

  res.json(users);
};
