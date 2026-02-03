import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(":Unauthorized", 401))
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("DECODED TOEKEN:", decoded);

    req.user = { 
      id: decoded.id, 
      role: decoded.role 
    };

    return next();
  } catch (error) {
    return next(new AppError("Invalid token", 400))
  }
};

export default authMiddleware;
