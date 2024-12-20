import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

// POST request for currently logged in user when clicks on toggle can flip on/off accepting message 
export async function POST(request: Request) {
    // Connect to database 
    await dbConnect();

    const session = await getServerSession(authOptions)
    // optionally accessing user from session
    const user: User = session?.user;

    if (!session || !session.user) {
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

    const userId = user._id;
    const {acceptMessages} = await request.json()

    try {
        // Update the user's message acceptance status
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages},
            { new: true }                    // return will be updated value 
        )

        if (!updatedUser) {
            // User not found
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept messages"
                },
                { status: 401 }
            )
        }
        // else-part -> Successfully updated message acceptance status
        return Response.json(
                {
                    success: true,
                    message: "Message acceptance status updates successfully", 
                    updatedUser
                },
                { status: 200 }
            )

    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept messages"
            },
            { status: 500 }
        )
    }
}


//GET request   
export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    // optionally accessing user from session
    const user: User = session?.user

    if (!session || !session.user) {
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

    const userId = user._id;

    try {
        // Retrieve the user from the database using the ID
        const foundUser = await UserModel.findById(userId)
    
        if (!foundUser) {
                return Response.json(
                    {
                        success: false,
                        message: "User not found"
                    },
                    { status: 404 }
                )
            }
    
            // Return the user's message acceptance status 
            return Response.json(
                    {
                        success: true,
                        isAcceptingMessages: foundUser.isAcceptingMessage
                    },
                    { status: 200 }
                )
    } catch (error) {
        console.log("failed to update user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptance status"
            },
            { status: 500 }
        )
    }
}