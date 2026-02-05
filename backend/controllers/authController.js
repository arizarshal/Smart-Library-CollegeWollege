import User from '../models/user.js';
import { loginService, registerService } from "../services/auth.service.js";
import AppError, { catchAsync} from '../utils/AppError.js';
import { createControllerLogger } from '../utils/controllerLogger.js';

const log = createControllerLogger("authController");

export const register = catchAsync(async (req, res) => {
  log.info(req, "register called", { email: req.body.email });
  
  const result = await registerService(req.body);

  log.debug(req, "register success", { userId: result.userId})
  
    return res.status(201).json({
      message: "Signup successful",
      userId: result.userId,
      name: result.name,
      token: result.token,
    });
  });

export const login = catchAsync(async (req, res) => {
  log.info(req, "Login called", { email: req.body.email})
  // const { email, password } = req.body;

  const result = await loginService(req.body);

  log.debug(req, "login success", {userId: result.userId, role: result.role})

    return res.status(200).json({
      message: "Login successful",
      userId: result.userId,
      name: result.name,
      token: result.token,
      role: result.role,
    });
});

export const profile = catchAsync(async (req, res) => {
  log.info(req, "Profile called", { userId: req.user.id })

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    log.debug(req, "profile success", { userId: user._id})
    res.status(200).json(user);
  })
