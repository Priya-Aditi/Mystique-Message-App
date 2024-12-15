import {z} from 'zod';

export const usernameValidation = z
    .string()                                                                     // only i have to check single thing i.e. email
    .min(2, "Username should be atleast of 2 characters")
    .max(20, "Username must be no more than 20 characters")
    .regex(/^[a-zA-Z0-9]+$/,"Username must not contain specia; character");


export const signUpSchema = z.object({
    // i have to check many things so made object
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),                   
    password: z
    .string()
    .min(6,{message: "password must be atleast 6 characters"}),
});