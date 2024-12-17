import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    // optionally accessing user from session
    const _user: User = session?.user

    if (!session || !_user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    } 

    // since we are taking user in string(check auth/options.ts) so we are trying to make it accept mongoose object in userId
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        // aggregation pipeline
        const user = await UserModel.aggregate([
            { $match: {_id: userId } },                      // first pipeline   //1. there can be many user, give me tha user whose id matches
            { $unwind: '$messages' },                      // second piepline ....   unwind arrays, unwind which parameter? = messages
            { $sort: {'messages.createdAt': -1 } },       // now here we can performs operations
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },    // grouping 
        ]).exec();

        if(!user || user.length === 0) {
            return Response.json(
            {
                success: false,
                message: "User not found"
            },
            { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages  
            },
            { status: 200 }
            )
    } catch (error) {
        console.log("An unexpected error occurred: ", error);
        return Response.json(
                {
                    success: false,
                    message: 'Internal server error'
                },
                { status: 500 }
            )
    }

}