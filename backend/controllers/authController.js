import User from '../models/user.js';
import { loginService, registerService } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const result = await registerService({
      name,
      email,
      password,
    });

    return res.status(201).json({
      message: "Signup successful",
      userId: result.userId,
      name: result.name,
      token: result.token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);

    return res.status(error.statusCode || 400).json({
      message: error.message || "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginService({
      email,
      password,
    });

    return res.status(200).json({
      message: "Login successful",
      userId: result.userId,
      name: result.name,
      token: result.token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);

    return res.status(error.statusCode || 400).json({
      message: error.message || "Server error",
    });
  }
}

// Profile
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: 'Server error' });
  }
}