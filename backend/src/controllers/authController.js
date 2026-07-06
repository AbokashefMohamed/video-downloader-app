import { User } from "../models/User.js";
import { validateEmail, validatePassword } from "../utils/validators.js";
import { signToken } from "../utils/jwt.js";

// Register a new user after validating the provided information
export async function register(req, res) {
  const { email, password, name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (name.trim().length > 50) {
    return res
      .status(400)
      .json({ message: "Name must be 50 characters or less" });
  }

  const emailError = validateEmail(email);
  if (emailError) {
    return res.status(400).json({ message: emailError });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "An account with this email already exists" });
  }

  const user = await User.create({ email, password, name });
  const token = signToken(user._id.toString());
  res.status(201).json({
    token,
    id: user._id,
    email: user.email,
    name: user.name,
  });
}

// Authenticate a user and return a JWT token on successful login. /
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user._id.toString());

  res.json({
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
}

// Return the authenticated user's profile information. /
export async function getMe(req, res) {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ id: user._id, email: user.email, name: user.name });
}

/*  Update the authenticated user's profile details. 
    Supports changing the display name and password. */
export async function updateProfile(req, res) {
  const { name, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.userId).select("+password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name !== undefined) {
    if (!name.trim()) {
      return res.status(400).json({ message: "Name cannot be empty" });
    }
    user.name = name.trim();
  }

  if (newPassword) {
    if (!currentPassword) {
      return res
        .status(400)
        .json({ message: "Current password is required to change password" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }
    user.password = newPassword;
  }

  await user.save();

  res.json({
    id: user._id,
    email: user.email,
    name: user.name,
    message: "Account updated successfully",
  });
}

// delete the authenticated user's account * after verifying their password./
export async function deleteAccount(req, res) {
  const { password } = req.body;

  if (!password) {
    return res
      .status(400)
      .json({ message: "Password is required to delete your account" });
  }

  const user = await User.findById(req.userId).select("+password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  await user.deleteOne();

  res.json({ message: "Account deleted successfully" });
}
