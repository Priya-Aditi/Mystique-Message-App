import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernameValidation} from "@/schemas/signUpSchema";


// Query Schema
const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
// // TODO: Use this in all other routes
//     if(request.method !== 'GET'){           // whenever their is any other method other than GET then we will return response coz we are accepting only GET request
//         return Response.json({
//                 success: false,
//                 message: 'Method not allowed', 
//             }, {status: 405})
//     }                                          This is not required in newer versions of next.js

    await dbConnect();
    
    try {
        const {searchParams} = new URL(request.url)
        // now from searchParam we need to find out my query out of many query
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result)  // try , remove afterwards
        if(!result.success){
            // if not success (case: when rather than using characters and numbers user used some special character => then failed)
            const usernameErrors = result.error.format().username?._errors || []           
            return Response.json({
                success: false,
                message: usernameErrors?.length>0? usernameErrors.join(', '): 'Invalid query parameters', 
            }, {status: 400}) 
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})               // if user have both these things that means you are existing user

        if(existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken', 
            }, {status: 400})
        }

        return Response.json({
                success: true,
                message: 'Username is unique', 
            }, {status: 400}) 

    } catch (error) {
        console.error("Error checking username", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {status: 500} 
        )
    }
    
}