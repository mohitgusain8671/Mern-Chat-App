import { config } from "dotenv";

config( { path: `.env` } );

export const { 
    PORT, NODE_ENV,
    DB_URI,
    JWT_SECRET, JWT_EXPIRES_IN,
    ARCJET_ENV, ARCJET_KEY,
    ORIGIN
} = process.env