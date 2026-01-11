import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = await User.create({ name, email, password});

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({ 
      message: "Signup successful",
      userId: newUser._id,
      name: newUser.name,
 
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: 'Server error 1' });
  }
};

// Login an existing user
export const login = async (req, res) => {
  try {
    const { email, password, name} = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    
    res.status(200).json({ 
      message: "Login successful",
      userId: user._id,
      name: user.name,
      token
    });
} catch (error) {
    res.status(500).json({ message: 'Server error' });
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