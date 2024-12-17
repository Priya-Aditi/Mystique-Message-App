import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();    
    try {
        //three fields: email, username and password
        const {username, email, password} = await request.json()
        // now conditions - refer algo
        //*****1st condition******//
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        }); 

        if(existingVerifiedUserByUsername){
            return Response.json({
                success: false,       //false coz already registered so cannot be register
                message: "Username is already taken",
            }, 
            {status: 400});
        }

        //******2nd condition******//
        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                {
                success: false,       
                message: "User already exist with the email",    
                }, 
                {status:400});
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;                  // exixting user but doesnt remember password
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }else{
             // if existing user by email is not present in db then it means user is first time, so first register
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            // register new user
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();              // new user got saved
        }

        // send verififcation email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if(!emailResponse.success){
            return Response.json({
                success: false,       
                message: emailResponse.message        // we did not hard coded here, there is a message written in email response
            }, {status:500});
        }

        return Response.json({
                success: true,       
                message: "User registered successfully. Please verify your email.",
            }, {status:201});

    } catch (error) {
        console.error('Error registering user', error);        // shows at terminal
        return Response.json(
            {
                success: false,
                message: "Error registering user",             // shows at frontend
            },
            {
                status: 500
            }
        );
    }
}
