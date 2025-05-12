import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI) {
    throw new Error('Please define MONGODB_URI environment variable in env file');
}

const connectToDB = async () => {
    try {
        await mongoose.connect(DB_URI)

        console.log(`Connect to database in ${NODE_ENV} mode`)
    } catch(error) {
        console.error('Error Connecting to database: ',error);
        process.exit(1);
    }
}

export default connectToDB;