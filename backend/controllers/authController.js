import User from '../models/user.js';
import { loginService, registerService } from "../services/auth.service.js";
import AppError, { catchAsync} from '../utils/AppError.js';

export const register = catchAsync(async (req, res) => {
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
  });

export const login = catchAsync(async (req, res) => {
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
      role: result.role,
    });
});

export const profile = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.status(200).json(user);
  })
