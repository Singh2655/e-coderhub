"use client"

import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import { Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
 } from '../ui/form'
import { z } from 'zod'
import { Button } from '../ui/Button'
import { Input } from "@/components/ui/input"
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSetRecoilState } from 'recoil'
import { authModalState } from '@/atoms/authModalAtom'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/Firebase/firebase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { RiLoader4Line } from "react-icons/ri";
import { doc, setDoc } from 'firebase/firestore'


type Props = {}

const formSchema = z.object({
    username:z.string(),
    email: z.string().email( {
      message: "Use a valid email address.",
    }),
    password:z.string().min(6,{
        message:"Password must be at least 6 characters"
    })
  })

const SignUp = (props: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          username:"",
          password:"",
        },
      })
     
      // 2. Define a submit handler.
      const router=useRouter()
     
      async function  onSubmit(values: z.infer<typeof formSchema>) {
        
        const {username,email,password}=values
        try {
          toast.loading('Creating your account',{
            id:'loadingToast'
          })
          const newUser=await createUserWithEmailAndPassword(email, password)
          if(!newUser)return
          const userData={
            uid:newUser.user.uid,
            username:username,
            email:newUser.user.email,
            createdAt:Date.now(),
            updatedAt:Date.now(),
            likedProblems:[],
            dislikedProblems:[],
            solvedProblems:[],
            starredProblems:[]
          }
          await setDoc(doc(firestore,"users",newUser.user.uid),userData)
          toast.success('you are logged in successfully')
          router.push('/')
        } catch (err:any) {
          alert(error?.message)
          toast.error(error?.message)
        }
        finally{
          toast.dismiss('loadingToast')
        }
      }
      const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useCreateUserWithEmailAndPassword(auth);
      // useEffect(()=>{
      //   if(error){
      //     alert(error.message)
      //   }
      // },[error])
      const handleClick=(type:"login" | "register" | "forgotPassword")=>{
        setAuthModalState((prev)=>({...prev,type}))
      }
      const setAuthModalState=useSetRecoilState(authModalState)


  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-4">
      <h3 className=' text-xl font-medium text-white'>Register to E-coderhub</h3>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem >
            <FormLabel className='text-white font-bold text-sm ml-3'>Username</FormLabel>
            <FormControl>
              <Input placeholder="helldiver" {...field} className='mx-auto w-full'/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem >
            <FormLabel className='text-white font-bold text-sm ml-3'>Email</FormLabel>
            <FormControl>
              <Input placeholder="shaurya@gmail.com" {...field} className='mx-auto w-full'/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-white font-bold text-sm ml-3'>Your Password</FormLabel>
            <FormControl>
              <Input placeholder="******" {...field}  className='mx-auto w-full'/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="flex mx-auto mt-2 w-[380px]">
        <div className="flex mr-1">
            {loading?<RiLoader4Line />:""}
            </div>
            Submit</Button>
      <div className="p-2 mb-2">
      <p className="px-8 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <button
            onClick={()=>handleClick("login")}
            className="text-blue-700 hover:text-blue-500 text-sm underline underline-offset-4 mb-2"
          >
            Sign Up
          </button>
        </p>
        </div>
    </form>
  </Form>

  )
}

export default SignUp