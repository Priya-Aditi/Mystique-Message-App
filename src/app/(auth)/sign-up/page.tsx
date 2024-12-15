'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import *as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Award, Loader2 } from "lucide-react"
import { Message } from './../../../model/User';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
//rafce shortcut


const page = () => {
    const [ username, setUsername ] = useState('')
    const [ usernameMessage, setUsernameMessage ] = useState('')          // if username is available or not when we send this request backend will send something - message will be displayed 
    const [ isCheckingUsername, setIsCheckingUsername ] = useState(false)     //the work behind when we send request, to manage that state we need loading state. this will be in boolean, by default we keeping false
    const [ isSubmitting, setIsSubmitting ] = useState(false)

    //hook
    const debounced = useDebounceCallback(setUsername, 300)    // means 300 milliseconds after check.. the request which i am firing is in debounced way(to avoid every keyword request which can cause server load)
    const { toast } = useToast()
    const router = useRouter();

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({                                 // we can add resolver     <z.infer>(optional)- it is typescript that shows what type of value will infer in z
        resolver: zodResolver(signUpSchema),                // zodResolver need schema
        defaultValues: {
        username: '',                                     // default values
        email: '',
        password: ''
        }
    })             

    // using hook. After debouncing there should be arequest going to backend that shows is the username available or not
    useEffect(() => {
        // username check
        const checkUsernameUnique = async () => {
        if(username) {
            setIsCheckingUsername(true)
            setUsernameMessage('')
            try {
            // sending request using axios, we can use react query also other than axios 
            const response = await axios.get(`/api/check-username-unique?username=${username}`)  
            setUsernameMessage(response.data.message)                                              // axios : try printing response                 
            } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(
                axiosError.response?.data.message ?? "Error checking username"
            )
            } finally {
            setIsCheckingUsername(false)                                           // if you dont want to write finally, you can write setIsCheckingUsername(false) in both try and catch part
            }
        }
        }
        checkUsernameUnique()                                         // run
    }, [username])                                          // useEffect(() => {callback}, [dependancy array])

    // submit
    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
        const response = await axios.post<ApiResponse>('/api/sign-up', data)                           // try printing data  
        //response is coming fine, now toast                                                                
        toast({
            title: 'Success',
            description: response.data.message
        })
        router.replace(`/verify/${username}`)                                         // when signup success, then tale user to /verify/username    
        setIsSubmitting(false)
        } catch (error) {
        console.error("Error in signup of user", error)
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message
        toast({
            title: "Signup failed",
            description: errorMessage,
            variant: "destructive"
        })
        setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight log:text-5xl mb-6">Join Shade Message</h1>
            <p className="mb-4">Sign up to start sending anonymous messages</p>
            </div>
            <Form {...form}>                                                          
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                name="username"
                control={form.control}                                              // control has been given to form
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="username" 
                        {...field} 
                        onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)                                //this is written only becuase we have cutomize usage
                        }}
                        />   
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin"/>}   
                    <p className={`text-sm ${usernameMessage === "Username is uniques" ? 'text-green-500' : 'text-red-500'}`}>
                        test {usernameMessage}
                    </p>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                name="email"                                                           // for email field
                control={form.control}                                              
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="email" 
                        {...field} 
                        />                            
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                name="password"                                                           // for password field
                control={form.control}                                              
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="password" 
                        {...field} 
                        />                            
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isSubmitting}>
                {
                    isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please Wait..
                    </>
                    ) : ('Signup')                                                // javascript  // isSubmitting ? (1stcase) : (2nd case)     
                }
                </Button>
            </form>
            </Form>
            <div className="text-center mt-4">
            <p>
                Already a member?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                Sign In
                </Link>
            </p>
            </div>
        </div>
        </div>
    )
    }

    export default page
