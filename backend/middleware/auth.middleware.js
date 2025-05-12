import jwt from'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

const authorize = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // Check if token is valid
        if(!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }
        // decode the token and Verify the token using JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ message: "Unauthorized, invalid token" });
        } 
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized", error: error.message });
    }

};

export default authorize;