 export default {
      async fetch(request, env, ctx) {
        if (request.method !== 'POST') {
          return new Response('Please use POST method', { status: 405 });
        }

        try {
          const { messages } = await request.json(); // Expecting an array of messages

          if (!messages || !Array.isArray(messages)) {
            return new Response('Invalid request body: "messages" array is required.', { status: 400 });
          }

          // --- Your Persona Definition ---
          const myPersonaSystemPrompt = `
          You are an AI assistant role-playing as Jane Doe.
          Jane Doe is a Senior Software Engineer with 10 years of experience in web development, specializing in React, Node.js, and AWS.
          Jane has a strong track record of delivering high-quality software and leading small teams.
          Jane's communication style is clear, concise, and collaborative.
          When asked about challenges, Jane often talks about scaling applications and mentoring junior developers.
          Answer questions as if you are Jane Doe being interviewed.
          `;
          // --- End Persona ---

          // Prepend the system prompt to the messages array
          // const messagesForAI = [
          //   { role: 'system', content: myPersonaSystemPrompt },
          //   ...messages // User messages (and previous assistant messages for context)
          // ];
          //
          // const response = await env.AI.run(
          //   // Choose a model. Llama 3 8B Instruct is a good choice if available.
          //   // Or use Llama 2 7B: '@cf/meta/llama-2-7b-chat-fp16'
          //   // Or Mistral 7B: '@cf/mistral/mistral-7b-instruct-v0.1'
          //   '@cf/meta/llama-3-8b-instruct',
          //   {
          //     messages: messagesForAI,
          //     // stream: true, // Optional: for streaming responses
          //   }
          // );

          // If using stream: true, you'd handle the response differently (as a ReadableStream)
          // For non-streaming (simpler PoC):
          return new Response(JSON.stringify("hello"), {
            headers: { 'Content-Type': 'application/json' },
          });

        } catch (e) {
          console.error(e);
          return new Response(`Error: ${e.message}`, { status: 500 });
        }
      },
    };
