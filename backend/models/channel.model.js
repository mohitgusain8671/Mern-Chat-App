import mongoose from 'mongoose'
import Message from './message.model.js'
const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.ObjectId, 
            ref: 'User',
            required: true
        }
    ],
    admin: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.ObjectId, 
            ref: 'Messages',
            required: false
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

channelSchema.pre("save",function(next){
    this.updated_at = Date.now();
    next();
})
channelSchema.pre("findOneAndUpdate",function(next){
    this.set({ updated_at: Date.now() });
    next();
})
channelSchema.pre('findOneAndDelete', async function (next) {
    const channel = await this.model.findOne(this.getQuery());
    if (channel && channel.messages && channel.messages.length > 0) {
        await Message.deleteMany({ _id: { $in: channel.messages } });
    }
    next();
});

const Channel = mongoose.model("Channels",channelSchema);

export default Channel;