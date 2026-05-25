import mongoose from "mongoose";
import logger from "../utils/logger.js";
const connectDB=async()=>{
    try{
        const mongoURI=process.env.MONGODB_URI;
        if(!mongoURI){
            throw new Error("MONGODB_URI is not defined in your .env file");
        }
        const conn=await mongoose.connect(mongoURI);
        logger.info(`MongoDB connected: ${conn.connection.host}`);
    }
    catch(error){
        logger.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;