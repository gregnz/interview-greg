// src/routes/api/chat/+server.ts
import type {RequestHandler} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';
import {dev} from '$app/environment'; // To check if in development
import {env as privateEnv} from '$env/dynamic/private'; // For server-side env vars

export const POST: RequestHandler = async ({request, platform, url}) => {
    // if (!DEDICATED_AI_WORKER_URL) {
    //     console.error("DEDICATED_AI_WORKER_URL is not set.");
    //     // return json({error: "Server configuration error: AI worker URL not set."}, {status: 500});
    // }

    console.log("Post request", request, url)

    try {
        const body = await request.json();
        const messages = body.messages; // Expects { messages: [ {role: 'user', content: '...'}, ... ] }

        if (!messages || !Array.isArray(messages)) {
            return json({error: 'Invalid request: "messages" array is required.'}, {status: 400});
        }
        let pagesFunctionChatUrl: string;
        if (dev) {
            // For local development with `wrangler pages dev` (e.g., on port 8788 by default)
            // Ensure your wrangler pages dev proxies to your SvelteKit dev server.
            // The Pages function will be served by wrangler itself.
            // This URL might need adjustment based on your `wrangler pages dev` port.
            pagesFunctionChatUrl = `http://localhost:8788/api/chat`;
            // If wrangler is on a different port, or if you have a more complex proxy setup:
            // console.warn("Ensure `wrangler pages dev` is running and serving functions on the correct port for local development calls to Pages Functions.");
        } else {
            // In production on Cloudflare Pages, the function is at a relative path from the origin
            // `url.origin` gives you the base URL of your SvelteKit app (e.g., https://your-app.pages.dev)
            pagesFunctionChatUrl = `${url.origin}/api/chat`;
        }

        console.log(pagesFunctionChatUrl)

        // Call your dedicated Cloudflare Worker that uses env.AI
        const aiWorkerResponse = await fetch(pagesFunctionChatUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({messages: messages}) // Pass the messages array directly
        });

        if (!aiWorkerResponse.ok) {
            const errorText = await aiWorkerResponse.text();
            console.error(`Error from AI worker: ${aiWorkerResponse.status} ${errorText}`);
            return json({error: `AI service error: ${errorText}`}, {status: aiWorkerResponse.status});
        }

        const aiData = await aiWorkerResponse.text();

        // The SvelteKit API route sends back the AI's response
        // Adjust the key 'aiResponse' if your AI worker returns data differently
        return json({aiResponse: aiData}, {status: 200});

    } catch (error) {
        console.error('Error in /api/chat:', error);
        return json({error: `Internal server error: ${error.message}`}, {status: 500});
    }
};