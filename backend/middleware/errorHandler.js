import AppError from "../utils/AppError.js";

const errorHandler = (err, req, res, next) => {
   let error = err

    //    default values
    if (!error.statusCode) error.statusCode = 500
    if (!error.status) error.status = `${error.statusCode}`.startsWith("4") ? "fail" : "error"

    // Mongoose: invalid objectId
    if (error.name === "CastError") {
        error = new AppError(`Invalid ${error.path}: ${error.value}`, 400)
    }

    //Mongoose: Validation Error
    if (error.name === "ValidationError") {
        const message = Object.values(error.errors)
            .map((e) => e.message)
            .join(", ")
        error = new AppError(message, 400)
    }

    // MongoDB: Duplicate key
    if (error.code === 11000) {
        const fields = Object.keys(error.keyValue || {}).join(",")
        error = new AppError(`Duplicate value for ${fields}`, 400)
    }

    // If not operational, hiding details 
   if (!error.isOperational) {
       error = new AppError('Internal Server Error', 500);
   }

   res.status(error.statusCode).json({
       status: error.status,
       message: error.message,
   });
};

export default errorHandler;