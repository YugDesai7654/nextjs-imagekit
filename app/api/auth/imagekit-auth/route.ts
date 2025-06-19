// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
   

    try {
        const authenticationParameter = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, 
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
            
        })
    
        return Response.json({ authenticationParameter, publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY })
    } catch (error) {
        return Response.json(
            { error: "Authentication failed for imagekit" },
            { status: 500 }
        )

    }
}