import {clerkMiddleware} from '@clerk/nextjs/server'
import {lettaMiddleware} from "@letta-ai/letta-nextjs/server";


export default clerkMiddleware(async (_, req) => {
    return lettaMiddleware(req, {
        apiKey: process.env.LETTA_API_KEY || '',
        baseUrl: process.env.LETTA_API_BASE_URL || '',
    })
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
}