import { User } from "../models/User.js";
import mongoose from "mongoose";
// returns every user in the system (admin only)
export async function listUsers(req, res) {
  const users = await User.find().select("email name role createdAt");
  res.json(users);
}

// lets an admin update another users name or role

export async function adminUpdateUser(req, res) {
  const { id } = req.params;
  const { name, role } = req.body;
  const allowedRoles = ["user", "admin"];

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    user.name = name.trim();
  }

  if (role !== undefined) {
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    user.role = role;
  }

  await user.save();

  res.json({
    message: "User updated successfully",
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
  });
}

// lets an admin delete another users account
export async function adminDeleteUser(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
}
