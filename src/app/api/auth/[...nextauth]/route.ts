import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);    //NextAuth is a method that takes options, so we kept a separate file for options(authoptions)

export {handler as GET, handler as POST};        //we do export so that we can use it.