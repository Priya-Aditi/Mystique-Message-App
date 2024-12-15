import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [                                                           // find using username or email 
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ],
                    });
                    if(!user){
                        throw new Error('No User Found with this email.');                               // if we cannot find user
                    }
                    if(!user.isVerified){
                        throw new Error('Please verify your account before login');        // when user is not verified
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect){
                        return user;                                                        // return user is going to providers 
                    }else{
                        throw new Error('Incorrect Password');
                    }
                } catch (err: any) {
                    throw new Error(err);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString()           //did so that, Object id changes to string
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    }, 
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,     // very imp 
    pages: {
        signIn: '/sign-in',
    },                  
};
