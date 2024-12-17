import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function DELETE(
    request: Request, {params}: {params: {messageid: string}}) {
    //before connecting to db we will extract the message if first
    const messageId = params.messageid
    await dbConnect();
    const session = await getServerSession(authOptions)
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
    try {
        const updateResult = await UserModel.updateOne(
            // on which basis we will match
            {_id: _user._id},
            {$pull: {messages: {_id: messageId}}}
        )
        if (updateResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message Deleted"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error is delete message route", error)
        return Response.json(
            {
                success: false,
                message: "Error deleting message"
            },
            {
                status: 500
            }
        )
    } 
}