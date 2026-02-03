const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {      
        return next(new AppError("User role not found", 403));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    
    return next();
  };
};

export default authorizeRoles;
