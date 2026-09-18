<script lang="ts">
  interface Citation {
    text: string;
    references: { content: string; source: string }[];
  }

  interface Message {
    role: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
  }

  let messages: Message[] = [];
  let input = '';
  let loading = false;
  let conversationId = createConversationId();
  let chatContainer: HTMLDivElement;

  function createConversationId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    input = '';
    loading = true;

    // Add user message
    messages = [...messages, { role: 'user', content: userMessage }];

    // Add empty assistant message that will be streamed into
    messages = [...messages, { role: 'assistant', content: '', citations: [] }];
    const assistantIndex = messages.length - 1;

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
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processEvent = (event: string) => {
        const dataLine = event
          .split(/\r?\n/)
          .find((line) => line.trim().startsWith('data:'))
          ?.trim();

        if (!dataLine) return;

        try {
          const data = JSON.parse(dataLine.slice(5).trim());

          if (data.type === 'text') {
            messages[assistantIndex] = {
              ...messages[assistantIndex],
              content: messages[assistantIndex].content + (data.content ?? '')
            };
            messages = [...messages];
          }

          if (data.type === 'citations') {
            messages[assistantIndex] = {
              ...messages[assistantIndex],
              citations: [
                ...(messages[assistantIndex].citations ?? []),
                ...(data.citations ?? [])
              ]
            };
            messages = [...messages];
          }

          if (data.type === 'error') {
            messages[assistantIndex] = {
              ...messages[assistantIndex],
              content: messages[assistantIndex].content || 'Sorry, something went wrong.'
            };
            messages = [...messages];
          }
        } catch {
          // Skip malformed JSON
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) processEvent(buffer);
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events from the buffer
        const lines = buffer.split(/\r?\n\r?\n/);
        buffer = lines.pop() ?? ''; // Keep incomplete chunk in buffer

        for (const line of lines) processEvent(line);
      }
    } catch (error) {
      // If streaming failed entirely, update the assistant message
      if (!messages[assistantIndex].content) {
        messages[assistantIndex] = {
          ...messages[assistantIndex],
          content: 'Sorry, something went wrong. Please try again.'
        };
        messages = [...messages];
      }
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
    conversationId = createConversationId();
  }

  // Auto-scroll to bottom as text streams in
  $: if (messages.length && chatContainer) {
    setTimeout(
      () => chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' }),
      50
    );
  }
</script>

<div class="chat-wrapper">
  <div class="chat-header">
    <h2>💬 Chat with Lorelyn</h2>
    <button class="new-chat-btn" on:click={newChat} disabled={loading}>New Chat</button>
  </div>

  <div class="chat-messages" bind:this={chatContainer}>
    {#if messages.length === 0}
      <div class="empty-state">
        <p>Ask me anything about my allowance!</p>
      </div>
    {/if}

    {#each messages as message, i}
      <div class="message {message.role}">
        <div class="message-bubble">
          {#if message.role === 'assistant' && !message.content && loading && i === messages.length - 1}
            <div class="loading-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          {:else}
            <p>{message.content}</p>
          {/if}

          {#if message.citations?.length}
            <details class="citations">
              <summary>📚 Sources ({message.citations.length})</summary>
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
      {loading ? '...' : 'Send'}
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
    background: #f1f1f1;
    color: #222;
    border-bottom-left-radius: 4px;
  }

  .message-bubble p {
    margin: 0;
    white-space: pre-wrap;
  }

  .chat-input {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #e0e0e0;
  }

  .chat-input textarea {
    flex: 1;
    resize: none;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font: inherit;
  }

  .chat-input button {
    padding: 0.5rem 1rem;
    border: 0;
    border-radius: 6px;
    background: #007bff;
    color: white;
    cursor: pointer;
  }

  .chat-input button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .loading-dots {
    display: flex;
    gap: 0.25rem;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #888;
    animation: blink 1.2s infinite ease-in-out;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes blink {
    0%, 80%, 100% { opacity: 0.3; }
    40% { opacity: 1; }
  }

  .citations {
    margin-top: 0.75rem;
    font-size: 0.85rem;
  }

  .citation-item {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #ddd;
  }

  .source { font-weight: 600; }
  .excerpt { margin: 0.25rem 0 0; }
</style>

