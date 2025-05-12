import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import mongoose from "mongoose";

export const signIn = async (req,res,next) => {
    try{
        const {email,password} = req.body;
        if(!email || !password) {
            const error = new Error('Email, and Password are required');
            error.statusCode = 400;
            throw error;
        }
        const user = await User.findOne({email});
        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        const isValidPassword = bcrypt.compareSync(password,user.password);
        if(!isValidPassword) {
            const error = new Error('Invalid Password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'None',
        });
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user,
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signUp = async (req,res,next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Logic to create new user
        const { email, password } = req.body;
        if (!email || !password) {
            const error = new Error('Email, and Password are required');
            error.statusCode = 400;
            throw error;
        }
        if (password.length < 6) {
            const error = new Error('Password must be at least 6 characters long');
            error.statusCode = 400;
            throw error;
        }
        // check if user already exist
        const exisitingUser = await User.findOne({email});
        if(exisitingUser) {
            const error = new Error('User already Exists');
            error.statusCode = 409;
            throw error;
        }
        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        // create new User
        const newUsers = await User.create([{email: email, password: hashedPassword}], { session });

        const token = jwt.sign(
            { userId: newUsers[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: 'User Created Successfully',
            data: {
                token,
                user: {
                    _id: newUsers[0]._id,
                    email: newUsers[0].email,
                    profileSetup: newUsers[0].profileSetup,
                }
            }
        })

    } catch(error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const getUserInfo = async (req,res,next) => {
    try{
        const user = await User.findById(req.userId);
        if(!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: 'User info fetched successfully',
            user: {
                _id: user._id,
                email: user.email,
                profileSetup: user.profileSetup,
                name: user.name,
                image: user.image,
                color: user.color,
            }
        });
    } catch(error) {
        next(error);
    }
};