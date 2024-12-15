import {z} from 'zod';

export const signInSchema = z.object({
    identifier: z.string(),              //can also be written email or username
    password: z.string(),
});