// functions/api/chat.ts
interface Env {
    AI: any;
}

export const onRequestPost: PagesFunction<Env> = async ({request, env}) => {
    // Your logic here
    const input = {prompt: "What is the origin of the phrase Hello, World"};
    const minimalValidInput = {
        messages: [
            {role: "system", content: "You are a helpful assistant."},
            {role: "user", content: "What is 2+2?"}
        ]
    };
    console.log("Attempting AI call with MINIMAL HARDCODED input:", JSON.stringify(minimalValidInput, null, 2));
    //
    // const answer = await env.AI.run(
    //     "@cf/meta/llama-3-8b-instruct",
    //     minimalValidInput,
    // );

    // const answer = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
    //     prompt: "What is the origin of the phrase 'Hello, World'"
    // });

    let answer = {
        response: `What a fascinating topic! The phrase "Hello, World" has a rich history, and I'm more than happy to enlighten you.\n` +
            '\n' +
            'The phrase "Hello, World" is often attributed to Brian Kernighan, a computer scientist who worked at Bell Labs in the 1970s. However, the phrase itself has been in use since the early days of computing.\n' +
            '\n' +
            'The first known occurrence of "Hello, World" was in 1861, when a British writer named Edward Bellamy wrote a short story called "Looking Backward: 2000-1887." In the story, the protagonist, a time traveler, visits a futuristic world where he is greeted with the phrase "Hello, world!" by a group of people.\n' +
            '\n' +
            'Fast-forwarding to the early days of computer programming, Brian Kernighan and his colleague, Dennis Ritchie, used the phrase "Hello, World" in their book "The C Programming Language" in 1978. They chose this phrase because it was short, easy to type, and easy to understand, making it an ideal test program for new programmers.\n' +
            '\n' +
            `Since then, "Hello, World" has become a de facto standard for introducing oneself in the programming world. It's often used as a simple program to test a new`,
        usage: {prompt_tokens: 55, completion_tokens: 256, total_tokens: 311}
    }

    console.log(answer)
    return Response.json(answer);

    return new Response("Hello from POST");
};

export const onRequestGet: PagesFunction<Env> = async () => {
    return new Response("Hello from GET");
};