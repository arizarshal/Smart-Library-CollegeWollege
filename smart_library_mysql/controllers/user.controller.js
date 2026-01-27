import { UserModel } from "../models/user.model.js";

export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const userId = await UserModel.create({ name, email });

    res.status(201).json({
      message: "User created successfully",
      userId,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

export const getUsers = async (req, res) => {
  const users = await UserModel.findAll();
  res.json(users);
};
