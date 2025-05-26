// src/routes/api/chat/+server.ts
import type {RequestHandler} from '@sveltejs/kit';
import {json} from '@sveltejs/kit';

export const POST: RequestHandler = async ({request, platform, url}) => {
    console.log("+server.ts POST handler")
    try {
        const body = await request.json();
        const messagesFromClient = body.messages;

        if (!messagesFromClient || !Array.isArray(messagesFromClient)) {
            return json({error: 'Invalid request: "messages" array is required.'}, {status: 400});
        }

        // Access the AI binding directly from platform.env
        const AI = platform?.env?.AI;
        if (!AI) {
            console.error("CRITICAL: AI binding not found in platform.env!");
            return json({error: "AI service not configured."}, {status: 500});
        }

        const myPersonaSystemPrompt = `
        You are an AI assistant role-playing as Jane Doe...
        `;

        const messagesForAI = [
            {role: 'system', content: myPersonaSystemPrompt},
            ...messagesFromClient
        ];

        console.log(`Standalone Worker: Calling AI with messages:`, JSON.stringify(messagesForAI, null, 2));

        const aiResponse = await AI.run( // Call AI directly
            "@cf/meta/llama-3.1-8b-instruct",
            {messages: messagesForAI}
        );

        return json({aiResponse: aiResponse}, {status: 200});

    } catch (error: any) {
        console.error('Error in SvelteKit /api/chat route (standalone worker):', error);
        // Check for InferenceUpstreamError specifically if you want
        if (error.name === 'InferenceUpstreamError') {
            return json({error: `AI Inference Error: ${error.message}`}, {status: 502}); // Bad Gateway
        }
        return json({error: `Internal server error: ${error.message}`}, {status: 500});
    }
}
