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
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
//rafce shortcut


const page = () => {
  

    const { toast } = useToast()
    const router = useRouter();

    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({     // we can add resolver     <z.infer>(optional)- it is typescript that shows what type of value will infer in z
        resolver: zodResolver(signInSchema),                // zodResolver need schema
        defaultValues: {                                   
        identifier: '',
        password: ''
        }
    })             

    // submit
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        // using nextAuth we will do signIn
        const result = await signIn('credentials', {
          redirect: false,
          identifier: data.identifier,
          password: data.password
        })
        // there can be error in result
        if (result?.error) {
          toast({
            title: "Login failed",
            description: "Incorrect username or password",
            variant: "destructive"
          })
        } 

        if (result?.url) {
          router.replace('/dashboard')
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight log:text-5xl mb-6">Join Shade Message</h1>
            <p className="mb-4">Sign in to start sending anonymous messages</p>
            </div>
            <Form {...form}>                                                          
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                name="identifier"                                                           // for email field
                control={form.control}                                              
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                        <Input placeholder="email/username" 
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
                <Button type="submit" >
                Signin
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
