import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const registerService = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("All fields required");
  }

  if (!validator.isEmail(email)) {
  const err = new Error("Invalid email address");
  err.statusCode = 400;
  throw err;
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
    const err = new Error("User already exists");
    err.statusCode = 400;
    throw err;
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
    const err = new Error("All fields required");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.statusCode = 400;
    throw err;
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