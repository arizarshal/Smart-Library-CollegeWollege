import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";


export const registerService = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError("All fields required", 400);
  }

  if (!validator.isEmail(email)) {
    throw new AppError("Invalid email address", 400);
  }

// if (!validator.isStrongPassword(password, {
//   minLength: 8,
//   minLowercase: 1,
//   minUppercase: 1,
//   minNumbers: 1,
//   minSymbols: 1,
// })) {
//   const err = new Error(
//     "Password must be at least 8 characters"  and include uppercase, lowercase, number, and special character"
//   );
//   err.statusCode = 400;
//   throw err;
// }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    userId: newUser._id,
    name: newUser.name,
    token,
  };
};




export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("All fields required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }
  if (!user.password) {
    throw new AppError("Invalid credentials", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    userId: user._id,
    name: user.name,
    token,
    role: user.role,
  };
};