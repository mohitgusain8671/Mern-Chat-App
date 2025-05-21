import mongoose from 'mongoose'
import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";

export const createChannel = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;
        if(!name || !members) {
            const error = new Error('Name and members are required');
            error.status = 400;
            throw error;
        }
        const admin = await User.findById(userId);
        if(!admin) {
            const error = new Error('Admin not found');
            error.status = 404;
            throw error;
        }
        const validMemebers = await User.find({
            _id: { $in: members }
        });
        if(validMemebers.length !== members.length) {
            const error = new Error('Some members are Invalid');
            error.status = 400;
            throw error;
        }
        const newChannel = await Channel.create({
            name,
            members,
            admin: userId
        });

        await newChannel.save();
        res.status(201).json({ 
            success: true,
            message: 'Channel created successfully' ,
            channel: newChannel
        });
    } catch (error) {
        next(error);
    }
}

export const getUserChannels = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({
            $or: [
                { admin: userId },
                { members: userId }
            ]
        }).sort({updatedAt:-1});

        return res.status(200).json({channels});

    } catch(error) {
        next(error);
    }
}

export const getChannelMessages = async (req, res, next) => {
    try{
        const { channelId } = req.params;
        const channel = await Channel.findById(channelId).populate({
            path: 'messages',
            populate: {
                path: 'sender',
                select: 'name email image _id color'
            }
        })
        if(!channel) {
            const error = new Error('Channel not found');
            error.status = 404;
            throw error;
        }
        return res.status(200).json({messages: channel.messages});

    } catch (err){

    }
}