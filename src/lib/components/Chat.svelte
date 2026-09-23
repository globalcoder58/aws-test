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

  function saveAndShare() {
    if (messages.length === 0) return;
    
    const chatText = messages
      .map(m => `${m.role === 'user' ? 'You' : 'Lorelyn'}: ${m.content}`)
      .join('\n\n');
      
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-with-lorelyn-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    navigator.clipboard.writeText(chatText).then(() => {
      alert('Chat history copied to clipboard and saved as a file!');
    }).catch(() => {
      alert('Chat history saved as a file!');
    });
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
    <div class="header-actions">
      <button class="save-share-btn" on:click={saveAndShare} disabled={messages.length === 0 || loading}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
        Save & Share
      </button>
      <button class="new-chat-btn" on:click={newChat} disabled={loading}>New Chat</button>
    </div>
  </div>

  <div class="chat-messages" bind:this={chatContainer}>
    {#if messages.length === 0}
      <div class="empty-state">
        
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
  width: 100%;
  min-height: 360px;
  max-height: 560px;
  margin: 0 auto;
  overflow: hidden;
  color: #edf7ff;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.15rem;
    border-bottom: 1px solid rgba(173, 216, 230, 0.16);
    background: rgba(255, 255, 255, 0.025);
  }

  .chat-header h2 {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0;
    color: #f8fafc;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .new-chat-btn, .save-share-btn {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    min-height: 38px;
    padding: 0.5rem 0.85rem;
    border: 1px solid rgba(169, 223, 242, 0.28);
    border-radius: 9px;
    color: #eaf8ff;
    font: inherit;
    font-size: 0.86rem;
    font-weight: 650;
    line-height: 1;
    cursor: pointer;
    background: rgba(169, 223, 242, 0.1);
    transition:
      transform 160ms ease,
      border-color 160ms ease,
      background 160ms ease;
  }

  .new-chat-btn:hover:not(:disabled), .save-share-btn:hover:not(:disabled) {
    border-color: rgba(110, 231, 255, 0.7);
    background: rgba(110, 231, 255, 0.18);
    transform: translateY(-1px);
  }

  .new-chat-btn:disabled, .save-share-btn:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .chat-messages {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.85rem;
    min-height: 260px;
    overflow-y: auto;
    padding: 1.25rem;
    scrollbar-width: thin;
    scrollbar-color: rgba(169, 223, 242, 0.35) transparent;
  }

  .chat-messages::-webkit-scrollbar {
    width: 8px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-messages::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: rgba(169, 223, 242, 0.3);
    background-clip: padding-box;
  }

  .empty-state {
    display: grid;
    flex: 1;
    min-height: 120px;
    place-items: center;
    padding: 1.5rem;
    color: #aebbd0;
    font-size: 0.98rem;
    line-height: 1.6;
    text-align: center;
  }

  .message {
    display: flex;
    width: 100%;
    margin: 0;
  }

  .message.user {
    justify-content: flex-end;
  }

  .message.assistant {
    justify-content: flex-start;
  }

  .message-bubble {
    max-width: min(78%, 560px);
    padding: 0.75rem 0.95rem;
    border: 1px solid transparent;
    border-radius: 15px;
    font-size: 0.96rem;
    line-height: 1.58;
    overflow-wrap: anywhere;
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.12);
  }

  .message.user .message-bubble {
    border-color: rgba(110, 231, 255, 0.24);
    border-bottom-right-radius: 5px;
    color: #06202b;
    background: linear-gradient(135deg, #8ce8ef 0%, #40c6e7 100%);
  }

  .message.assistant .message-bubble {
    border-color: rgba(173, 216, 230, 0.16);
    border-bottom-left-radius: 5px;
    color: #e7eef9;
    background: rgba(255, 255, 255, 0.075);
  }

  .message-bubble p {
    margin: 0;
    white-space: pre-wrap;
  }

  .chat-input {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.15rem;
    border-top: 1px solid rgba(173, 216, 230, 0.16);
    background: rgba(2, 6, 23, 0.22);
  }

  .chat-input textarea {
    width: 100%;
    min-width: 0;
    min-height: 46px;
    max-height: 130px;
    padding: 0.72rem 0.9rem;
    resize: vertical;
    border: 1px solid rgba(173, 216, 230, 0.24);
    border-radius: 10px;
    outline: none;
    color: #f8fafc;
    font: inherit;
    line-height: 1.45;
    background: rgba(255, 255, 255, 0.08);
    transition:
      border-color 160ms ease,
      box-shadow 160ms ease,
      background 160ms ease;
  }

  .chat-input textarea::placeholder {
    color: #9ca9c0;
  }

  .chat-input textarea:focus {
    border-color: #55ddea;
    background: rgba(255, 255, 255, 0.11);
    box-shadow: 0 0 0 3px rgba(85, 221, 234, 0.16);
  }

  .chat-input button {
    min-width: 76px;
    min-height: 46px;
    padding: 0.72rem 1rem;
    border: 0;
    border-radius: 10px;
    color: #05202b;
    font: inherit;
    font-weight: 750;
    cursor: pointer;
    background: linear-gradient(135deg, #81e6ee, #39bfe3);
    box-shadow: 0 8px 18px rgba(57, 191, 227, 0.2);
    transition:
      transform 160ms ease,
      filter 160ms ease,
      opacity 160ms ease;
  }

  .chat-input button:hover:not(:disabled) {
    filter: brightness(1.07);
    transform: translateY(-1px);
  }

  .chat-input button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    box-shadow: none;
  }

  .loading-dots {
    display: flex;
    align-items: center;
    gap: 0.32rem;
    min-height: 18px;
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #9de9f0;
    animation: blink 1.2s infinite ease-in-out;
  }

  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    0%,
    80%,
    100% {
      opacity: 0.25;
      transform: scale(0.85);
    }

    40% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .citations {
    margin-top: 0.8rem;
    font-size: 0.84rem;
  }

  .citation-item {
    margin-top: 0.55rem;
    padding-top: 0.55rem;
    border-top: 1px solid rgba(173, 216, 230, 0.16);
    color: #c8d4e5;
  }

  .source {
    color: #a9dff2;
    font-weight: 700;
  }

  .excerpt {
    margin: 0.25rem 0 0;
    color: #b7c4d7;
    line-height: 1.5;
  }

  .new-chat-btn:focus-visible,
  .save-share-btn:focus-visible,
  .chat-input textarea:focus-visible,
  .chat-input button:focus-visible {
    outline: 3px solid rgba(110, 231, 255, 0.8);
    outline-offset: 3px;
  }

  @media (max-width: 560px) {
    .chat-wrapper {
      min-height: 400px;
      max-height: 650px;
    }

    .chat-header {
      padding: 0.9rem 1rem;
    }

    .chat-header h2 {
      font-size: 0.95rem;
    }

    .new-chat-btn, .save-share-btn {
      padding-inline: 0.7rem;
      font-size: 0.8rem;
    }

    .chat-messages {
      min-height: 250px;
      padding: 1rem;
    }

    .message-bubble {
      max-width: 88%;
      font-size: 0.94rem;
    }

    .chat-input {
      flex-direction: column;
      align-items: stretch;
      padding: 0.9rem 1rem 1rem;
    }

    .chat-input button {
      width: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .new-chat-btn,
    .save-share-btn,
    .chat-input textarea,
    .chat-input button,
    .dot {
      transition: none;
      animation: none;
    }
  }
</style>
