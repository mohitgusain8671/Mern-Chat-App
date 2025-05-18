import Message  from '../models/message.model.js'

export const getMessages = async (req, res, next) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;
        if(!user1 || !user2) {
            const error = new Error("Both UserId are Required");
            error.status = 400;
            throw error;
        }
        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort({timestamp: 1});

        return res.status(200).json({
            messages
        });

    } catch (error) {
        next(error);
    }
}