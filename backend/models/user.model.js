import mongoose from "mongoose";

const userSchema = new mongoose.Schema ({
    name : { 
        type: String, 
        required: false,
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    image : {
        type: String,
        required: false,
    },
    email : { 
        type: String, 
        required: [true,'User Email is Required'], 
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 5,
        maxLength: 255,
        // / Reg Exp --> (/S+ --> some string followed by @ then /S+ -->  some string then . /S+ --> followed by some string) / 
        match: [/\S+@\S+\.\S+/,'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true,'Password is Required'], 
        minLength: 6,
    },
    color: {
        type: Number,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
    bio: {
        type: String,
        required: false,
        default: 'Hey , I am a user of Syncronus Chat App.',
        maxLength: 150,
        trim: true,
    }
}, {
    timestamps: true,
    versionKey: false
})

const User = mongoose.model('User',userSchema);

export default User;