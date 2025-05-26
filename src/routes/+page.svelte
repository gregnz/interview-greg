<script lang="ts">
    import { writable } from 'svelte/store';

    // Stores the conversation history
    // Each message: { role: 'user' | 'assistant', content: string }
    const messages = writable<{ role: string; content: string }[]>([
        { role: 'assistant', content: 'Hello! Ask me anything about my experience.' }
    ]);

    let userInput = '';
    let isLoading = false;

    async function sendMessage() {
        if (!userInput.trim() || isLoading) return;

        const newUserMessage = { role: 'user', content: userInput.trim() };
        messages.update(currentMessages => [...currentMessages, newUserMessage]);
        userInput = ''; // Clear input
        isLoading = true;

        // For context, send relevant part of conversation history
        // For simplicity here, we'll send all. For long conversations, you'd truncate.
        let historyForAI = [...$messages];

        // Optional: Limit history length sent to API to save tokens
        // const MAX_HISTORY_LENGTH = 10; // Last 5 Q&A pairs
        // if (historyForAI.length > MAX_HISTORY_LENGTH) {
        //     historyForAI = historyForAI.slice(-MAX_HISTORY_LENGTH);
        // }


        try {
            const response = await fetch('/api/chat', { // Calls our SvelteKit API route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: historyForAI }) // Send the current message plus history
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            // Assuming the AI worker (and thus this SvelteKit API route) returns:
            // { response: "AI's answer" } from the LLM
            // or whatever structure your AI worker actually returns
            console.log(data)
            const aiResponseText = JSON.parse(data.aiResponse).response || "Sorry, I couldn't get a response.";


            messages.update(currentMessages => [
                ...currentMessages,
                { role: 'assistant', content: aiResponseText }
            ]);

        } catch (error)
        {
            console.error("Error sending message:", error);
            messages.update(currentMessages => [
                ...currentMessages,
                { role: 'assistant', content: `Error: ${error.message}` }
            ]);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="chat-container">
    <div class="chat-output">
        {#each $messages as message (message.content + Math.random())}
            <div class="message {message.role}">
                <p>{message.content}</p>
            </div>
        {/each}
        {#if isLoading}
            <div class="message assistant typing">
                <p>Thinking...</p>
            </div>
        {/if}
    </div>

    <form class="chat-input" on:submit|preventDefault={sendMessage}>
        <input
            type="text"
            bind:value={userInput}
            placeholder="Type your question..."
            aria-label="User input"
            disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
            {#if isLoading}Sending...{:else}Send{/if}
        </button>
    </form>
</div>

