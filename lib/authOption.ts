import { error } from "console";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { dbConnect } from "./dbconnection";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name : "credentials",
            credentials : {
                email : {label : "Email" , type : "text"},
                password : {label : "Password" , type : "password"}
            },
            async authorize  (credentials ){
                if(!credentials?.email || !credentials.password){
                    throw new Error("email and password are required")
                }
                try {
                    await dbConnect();

                    const isUser = await User.findOne({email : credentials.email});

                    if(!isUser){
                        throw new Error("User not found");
                    }


                   const isValid =  await bcrypt.compare( credentials.password, isUser.password);

                   if(!isValid){
                        throw new Error("Invalid credentials");
                    
                   }

                   return {
                    id : isUser._id.to_string(),
                    email : isUser.email,
                   }

                } catch (error) {
                    throw new Error("Error while authorizing user");
                }

            }
        }),
    ],
    callbacks :{
        async jwt({user,token}){
            if(user){
                token.id = user.id;
                // token.email = user.email;
            }
            return token;
        },
        async session({session,token}){
            if(token){
                session.user.id = token.id as string;
            }
            return session; 
        }
    },
    pages: {
        signIn: "/login",
        error: "/login", // Error code passed in query string as ?error=
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days

    },
    secret : process.env.NEXTAUTH_SECRET,
};