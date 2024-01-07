"use client"

import React from 'react'
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
import { useRouter } from 'next/navigation'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/Firebase/firebase'
import { toast } from 'sonner'
import { RiLoader4Line } from 'react-icons/ri'

type Props = {}

const formSchema = z.object({
    email: z.string().email( {
      message: "Use a valid email address.",
    }),
    password:z.string().min(6,{
        message:"Password must be at least 6 characters"
    })
  })

const Login = (props: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
        },
      })

      const router=useRouter()

      const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof formSchema>) {
        const {email,password}=values
        console.log(email)
        console.log(password)
        try {
          const user=await signInWithEmailAndPassword(email,password)
          if(!user)return 
          toast.success('you are logged in successfully')
         router.push('/') 

        } catch (err:any) {
          if(err)toast.error('My error toast');
          console.log(err.message)
        }
        console.log(values)
      }

      const handleClick=(type:"login" | "register" | "forgotPassword")=>{
        setAuthModalState((prev)=>({...prev,type}))
      }
      const setAuthModalState=useSetRecoilState(authModalState)

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-4">
      <h3 className='text-xl font-medium text-white'>Login to E-coderhub</h3>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem >
            <FormLabel className='text-white font-bold text-sm ml-3'>Email</FormLabel>
            <FormControl>
              <Input placeholder="shaurya@gmail.com" {...field} className='mx-auto w-[380px]'/>
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
      <Button type="submit" className="flex mx-auto mt-2 w-full">
      <div className="flex mr-1">
            {loading?<RiLoader4Line />:""}
            </div>
            Submit
      </Button>
      <button className='flex w-full justify-end'>
        <p  className='text-sm block text-[#ffa116] hover:underline mr-2' onClick={()=>handleClick("forgotPassword")}>Forgot Password?</p>
      </button>
      <div className="p-2 mb-2">
      <p className="px-8 text-center text-sm text-gray-300">
          New to E-coderhub?{" "}
          <button
            onClick={()=>handleClick("register")}
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

export default Login