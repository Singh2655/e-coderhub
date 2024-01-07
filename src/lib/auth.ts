import { Connect } from "@/dbConfig/dbConfig";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import { db } from "./db";


export const AuthOptions:NextAuthOptions={
    session:{
        strategy:'jwt',
    },
    pages:{
        signIn:'/sign-in',
    },
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID!,
            clientSecret:process.env.GOOGLE_CLIENT_ID!,
        })
    ],
    callbacks:{
        async session({token,session}){
            if(token){
                session.user?.email===token.email
                session.user?.name===token.name
                session.user?.image===token.picture
            }
            return session
        },
        async jwt({token,user}){
            const dbUser=await db.findOne({
                where:{
                    email:token.email
                }
            })
            if(!dbUser){
                token.name!=user.name
                return token
            }
            

        }
    }
}