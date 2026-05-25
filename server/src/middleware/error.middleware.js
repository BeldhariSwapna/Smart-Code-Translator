import logger from "../utils/logger.js";

export const notFoundHandler=(req,res,next)=>{
    res.status(404).json({
        success:false,
        message:`Route not found: ${req.method} ${req.originalUrl}`,
    });
};

export const errorHandler=(err,req,res,next)=>{
    logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, { stack: err.stack });
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        message:err.message || "Something went wrong on the server.",
    });
};