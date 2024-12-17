import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    // values username and content taking from request.json
    const {username, content} = await request.json();
    try {
        const user = await UserModel.findOne({username});
        // if we couldn't find user
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                { status: 404 }
            )
        }

        // if user is found, then check is user accepting messages?
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: 'User is not accepting the messages'
                },
                { status: 403 }
            )
        }

        // user is there and accepting the messages also
        const newMessage = { content, createdAt: new Date() }
        // now where to push th emessages? => inside user -> message
        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json(
                {
                    success: true,
                    message: 'Message sent successfully'
                },
                { status: 404 }
            )

    } catch (error) {
        console.log("Error reading messages", error);
        return Response.json(
                {
                    success: false,
                    message: 'Internal server error'
                },
                { status: 500 }
            )
    }
}