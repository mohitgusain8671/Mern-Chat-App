import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js"


export const searchContacts = async (req, res, next) => {
    try {
        const { searchTerm } = req.body;
        if(searchTerm===undefined || searchTerm===null || searchTerm==='' ){
            const error = new Error('Search term is required');
            error.status = 400;
            throw error;
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g, 
            '\\$&'
        );

        const regex = new RegExp(sanitizedSearchTerm, 'i');
        const contacts = await User.find({
            $and: [
                {_id: { $ne: req.userId } },
                {$or: [
                    { name: regex },
                    { email: regex },
                ]}
            ]
        });

        const sanitizedContacts = contacts.map(contact =>{
                return {
                    _id: contact._id,
                    name: contact.name,
                    email: contact.email,
                    color: contact.color,
                    image: contact.image,
                }
        });

        return res.status(200).json({
            contacts: sanitizedContacts
        });

    } catch (error) {
        next(error);
    }
}

export const getDMContacts = async (req, res, next) => {
    try {
        let { userId } = req;
        if (!mongoose.isValidObjectId(userId)) {
            const error = new Error('Invalid user ID');
            error.status = 400;
            throw error;
        }
        userId = new mongoose.Types.ObjectId(userId);
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{sender: userId}, {recipient: userId}],
                },
            },
            { $sort: { timestamp: -1 } }, 
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            { $unwind: "$contactInfo" },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    name: "$contactInfo.name",
                    bio: "$contactInfo.bio",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            {
                $sort: { lastMessageTime: -1 },
            }
        ]);

        return res.status(200).json({ contacts });
    } catch (error) { 
        next(error);
    }
}

export const getAllContacts = async (req, res, next) => {
    try {
        const users = await User.find(
            {_id:{$ne:req.userId}},
            "name _id email"
        )
        if(!users) {
            const error = new Error('No contacts found');
            error.status = 404;
            throw error;
        }
        const contacts = users.map(user => ({
            label: user.name ? `${user.name}` : user.email,
            value: user._id,
            email: user.email,
        }));
        return res.status(200).json({contacts});

    } catch (error) {
        next(error);
    }
}