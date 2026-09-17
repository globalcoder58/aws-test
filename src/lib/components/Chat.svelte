
<script lang="ts">
  import { onMount } from 'svelte';

  interface Message {
    role: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
  }

  interface Citation {
    text: string;
    references: { content: string; source: string }[];
  }

  let messages: Message[] = [];
  let input = '';
  let loading = false;
  let conversationId = crypto.randomUUID();
  let chatContainer: HTMLDivElement;

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    input = '';
    messages = [...messages, { role: 'user', content: userMessage }];
    loading = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationId
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      messages = [
        ...messages,
        {
          role: 'assistant',
          content: data.answer,
          citations: data.citations
        }
      ];
    } catch (error) {
      messages = [
        ...messages,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }
      ];
    } finally {
      loading = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function newChat() {
    messages = [];
    conversationId = crypto.randomUUID();
  }

  // Auto-scroll to bottom
  $: if (messages.length && chatContainer) {
    setTimeout(() => chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' }), 100);
  }
</script>

<div class="chat-wrapper">
  <div class="chat-header">
    <h2>💬 Knowledge Base Chat</h2>
    <button class="new-chat-btn" on:click={newChat}>New Chat</button>
  </div>

  <div class="chat-messages" bind:this={chatContainer}>
    {#if messages.length === 0}
      <div class="empty-state">
        <p>Ask me anything about your knowledge base!</p>
      </div>
    {/if}

    {#each messages as message}
      <div class="message {message.role}">
        <div class="message-bubble">
          <p>{message.content}</p>

          {#if message.citations?.length}
            <details class="citations">
              <summary>📎 Sources ({message.citations.length})</summary>
              {#each message.citations as citation}
                {#if citation.references}
                  {#each citation.references as ref}
                    <div class="citation-item">
                      <span class="source">{ref.source}</span>
                      <p class="excerpt">{ref.content?.slice(0, 200)}...</p>
                    </div>
                  {/each}
                {/if}
              {/each}
            </details>
          {/if}
        </div>
      </div>
    {/each}

    {#if loading}
      <div class="message assistant">
        <div class="message-bubble loading">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    {/if}
  </div>

  <div class="chat-input">
    <textarea
      bind:value={input}
      on:keydown={handleKeydown}
      placeholder="Type your message..."
      rows="1"
      disabled={loading}
    ></textarea>
    <button on:click={sendMessage} disabled={loading || !input.trim()}>
      Send
    </button>
  </div>
</div>

<style>
  .chat-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .chat-header h2 { margin: 0; font-size: 1.2rem; }

  .new-chat-btn {
    padding: 0.4rem 0.8rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    cursor: pointer;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
  }

  .message {
    display: flex;
    margin-bottom: 1rem;
  }

  .message.user { justify-content: flex-end; }
  .message.assistant { justify-content: flex-start; }

  .message-bubble {
    max-width: 75%;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    line-height: 1.5;
  }

  .message.user .message-bubble {
    background: #007bff;
    color: white;
    border-bottom-right-radius: 4px;
  }

  .message.assistant .message-bubble {
    background: #f0f0f0;
    color: #333;
    border-bottom-left-radius: 4px;
  }

  .message-bubble p { margin: 0; }

  .citations {
    margin-top: 0.5rem;
    font-size: 0.85rem;
  }

  .citations summary {
    cursor: pointer;
    color: #555;
  }

  .citation-item {
    margin-top: 0.4rem;
    padding: 0.4rem;
    background: rgba(0,0,0,0.05);
    border-radius: 4px;
  }

  .source { font-weight: 600; font-size: 0.8rem; color: #007bff; }
  .excerpt { margin: 0.2rem 0 0; font-size: 0.8rem; color: #666; }

  .loading {
    display: flex;
    gap: 4px;
    padding: 1rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: #999;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }

  .chat-input {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #e0e0e0;
  }

  textarea {
    flex: 1;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    resize: none;
    font-size: 1rem;
    font-family: inherit;
  }

  .chat-input button {
    padding: 0.6rem 1.2rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }

  .chat-input button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
</style>

