import mongoose, {Schema, Document} from "mongoose";

// Message interface (Ts)
export interface Message extends Document{
    content: string;
    createdAt: Date;
}

// Message Schema (Mongoose)
const MessageSchema: Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now, 
    },
});


// User interface (Ts)
export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

// Updated User's Schema
const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],     // if !true - "Username is required"
        trim: true,                                  //if user give any space, then trim
        unique: true,
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please use a valid email address"], // to test valid email : regex (can chatgpt or go to RegExR website)
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
