<script>
  import Chat from '$lib/components/Chat.svelte';
</script>

<svelte:head>
  <title>Filipina Single Moms | Chat with Lorelyn</title>
  <meta
    name="description"
    content="Learn about Lorelyn's story, goals, and aspirations. Chat with Lorelyn in a supportive, personal space."
  />
</svelte:head>

<div class="page-shell">
  <main class="container">
    <section class="hero" aria-labelledby="page-title">
      <h1 id="page-title">
        Filipina <span class="title-highlight">Single Moms</span>
      </h1>

      <p class="intro">
        Lorelyn is a caring and family-oriented woman who is deeply attached
        to the people she loves. She is affectionate, persistent, and often
        turns to those close to her for emotional and practical support.
        Despite facing financial challenges, she remains determined to build an
        independent and hopeful future for herself and her family.
      </p>

      <img
        class="avatar"
        src="/Lorelynn.png"
        alt="Portrait of Lorelyn"
        width="180"
        height="180"
      />

      <p class="status-badge" aria-label="Lorelyn is available to chat">
        <span aria-hidden="true">●</span>
        Available to chat
      </p>
    </section>

    <section class="chat-section" aria-labelledby="chat-heading">
     

      <Chat />
    </section>
  </main>

  <footer class="footer">
  <p>created with AWS Bedrock + Sveltekit</p>
    <p>
      © {new Date().getFullYear()} | Built by
      <a
        href="https://uspekhi.web.app/contact"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit USPEKHI Web Development"
      >
        USPEKHI
      </a>
    </p>
  </footer>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    min-width: 320px;
    min-height: 100vh;
    margin: 0;
    color: #f8fafc;
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      sans-serif;
    background:
      radial-gradient(
        circle at 12% 8%,
        rgba(76, 201, 240, 0.12),
        transparent 32rem
      ),
      radial-gradient(
        circle at 90% 88%,
        rgba(59, 130, 246, 0.14),
        transparent 35rem
      ),
      linear-gradient(135deg, #171523 0%, #111827 48%, #0d1b2e 100%);
  }

  .page-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .container {
    width: min(100% - 2rem, 980px);
    flex: 1;
    margin: 0 auto;
    padding: clamp(2.5rem, 6vw, 5.5rem) 0 2rem;
    text-align: center;
  }

  .hero {
    display: grid;
    justify-items: center;
    gap: 1.25rem;
  }

  h1 {
    max-width: 980px;
    margin: 0;
    color: #f8fafc;
    font-size: clamp(2.5rem, 6.4vw, 5.75rem);
    font-weight: 800;
    line-height: 1.02;
    letter-spacing: -0.055em;
    text-wrap: balance;
  }

  .title-highlight {
    color: #a9dff2;
    text-shadow: 0 0 28px rgba(110, 231, 255, 0.12);
  }

  .intro {
    max-width: 700px;
    margin: 0.4rem auto 0;
    color: #d5dfef;
    font-size: clamp(1.05rem, 1.6vw, 1.3rem);
    font-weight: 400;
    line-height: 1.7;
    text-wrap: pretty;
  }

  .avatar {
    width: clamp(132px, 18vw, 180px);
    height: clamp(132px, 18vw, 180px);
    display: block;
    margin: 0.75rem auto 0;
    object-fit: cover;
    border: 3px solid #28d7e5;
    border-radius: 50%;
    background-color: #0b0d17;
    box-shadow:
      0 0 0 5px rgba(40, 215, 229, 0.09),
      0 0 28px rgba(40, 215, 229, 0.32);
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin: -0.2rem 0 0;
    padding: 0.4rem 0.75rem;
    border: 1px solid rgba(169, 223, 242, 0.2);
    border-radius: 999px;
    color: #b9c8dc;
    font-size: 0.84rem;
    line-height: 1;
    background: rgba(169, 223, 242, 0.06);
  }

  .status-badge span {
    color: #4ade80;
    font-size: 0.7rem;
    text-shadow: 0 0 8px rgba(74, 222, 128, 0.65);
  }

  .chat-section {
    width: min(100%, 760px);
    margin: clamp(2rem, 5vw, 3.5rem) auto 0;
    overflow: hidden;
    text-align: left;
    border: 1px solid rgba(173, 216, 230, 0.18);
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.58);
    box-shadow:
      0 18px 55px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(14px);
  }

  .footer {
    width: min(100% - 2rem, 980px);
    margin: 0 auto;
    padding: 2rem 0 2.5rem;
    color: #aebbd0;
    font-size: 0.9rem;
    text-align: center;
  }

  .footer p {
    margin: 0;
  }

  .footer a {
    color: #b5edf7;
    font-weight: 700;
    text-underline-offset: 3px;
  }

  .footer a:hover {
    color: #ffffff;
  }

  :global(button:focus-visible),
  :global(a:focus-visible),
  :global(input:focus-visible),
  :global(textarea:focus-visible) {
    outline: 3px solid rgba(110, 231, 255, 0.8);
    outline-offset: 3px;
  }

  @media (max-width: 560px) {
    .container {
      width: min(100% - 1.25rem, 980px);
      padding-top: 2.25rem;
    }

    h1 {
      font-size: clamp(2.35rem, 13vw, 3.6rem);
      letter-spacing: -0.045em;
    }

    .intro {
      font-size: 1.02rem;
      line-height: 1.65;
    }

  }

  @media (prefers-reduced-motion: reduce) {
    :global(*) {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
</style>