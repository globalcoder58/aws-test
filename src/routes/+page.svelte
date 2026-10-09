<script>
  import Chat from '$lib/components/Chat.svelte';
</script>

<svelte:head>
  <title>Filipina Single Moms | Chat with Lorelyn</title>

  <meta
    name="description"
    content="An AI-guided conversation experience sharing Lorelyn’s goals, challenges, and hopes for her family’s future."
  />

  <link rel="canonical" href="https://main.d21aztovm3rx60.amplifyapp.com/" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Filipina Single Moms" />
  <meta property="og:title" content="Filipina Single Moms | Chat with Lorelyn" />
  <meta
    property="og:description"
    content="An AI-guided conversation experience sharing Lorelyn’s goals, challenges, and hopes for her family’s future."
  />
  <meta property="og:url" content="https://main.d21aztovm3rx60.amplifyapp.com/" />

  <!-- Add a real 1200 × 630px social image before uncommenting this. -->
  <!--
  <meta
    property="og:image"
    content="https://main.d21aztovm3rx60.amplifyapp.com/og-image.jpg"
  />
  -->

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Filipina Single Moms | Chat with Lorelyn" />
  <meta
    name="twitter:description"
    content="An AI-guided conversation experience sharing Lorelyn’s goals, challenges, and hopes for her family’s future."
  />

  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Filipina Single Moms',
      url: 'https://main.d21aztovm3rx60.amplifyapp.com/',
      description:
        'An AI-guided conversation experience sharing Lorelyn’s goals, challenges, and hopes for her family’s future.'
    })}
  </script>
</svelte:head>

<a class="skip-link" href="#chat">Skip to chat</a>

<div class="page-shell">
  <main class="container">
    <section class="hero" aria-labelledby="page-title">
      <h1 id="page-title">
        Filipina <span class="title-highlight">Single Moms</span>
      </h1>

      <p class="tagline">
        An AI-guided conversation experience sharing Lorelyn’s goals,
        challenges, and hopes for her family’s future.
      </p>

      <img
        class="avatar"
        src="/Lorelynn.png"
        alt="Portrait of Lorelyn"
        width="210"
        height="210"
      />

      <p class="status-badge" aria-label="Lorelyn is available to chat">
        <span aria-hidden="true">●</span>
        Available to chat
      </p>
    </section>

    <section id="chat" class="chat-section" aria-label="Chat with Lorelyn">
      <Chat />
    </section>

    <aside class="ai-disclosure" aria-label="AI and privacy notice">
      <span class="disclosure-icon" aria-hidden="true">✦</span>

      <p>
        Lorelyn is an AI-guided conversational experience. Please do not share
        passwords, payment details, identity documents, or other sensitive
        personal information.
      </p>
    </aside>

    <section class="about-section" aria-labelledby="about-heading">
      <h2 id="about-heading">About this experience</h2>

      <p>
        This experience invites visitors to explore themes of family,
        independence, everyday budgeting, and future goals through a guided
        conversation with Lorelyn.
      </p>

      <div class="topic-list" aria-label="Suggested discussion topics">
        <span>Goals and aspirations</span>
        <span>Allowance and budgeting</span>
        <span>Family and daily life</span>
        <span>Building independence</span>
      </div>
    </section>
  </main>

  <footer class="footer">
    <p class="technology-credit">Created with AWS Bedrock and SvelteKit.</p>

    <nav class="footer-links" aria-label="Footer navigation">
      <a href="/privacy">Privacy</a>
     
      <a href="https://uspekhi.web.app/contact" target="_blank" rel="noopener noreferrer">
        Contact / Report a concern
      </a>
    </nav>

    <p class="creator-credit">
      © {new Date().getFullYear()} | Built by
      <a
        href="https://uspekhi.web.app"
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

  .skip-link {
    position: fixed;
    z-index: 10;
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    color: #06202b;
    font-weight: 700;
    text-decoration: none;
    background: #81e6ee;
    transform: translateY(-150%);
    transition: transform 160ms ease;
  }

  .skip-link:focus {
    transform: translateY(0);
  }

  .page-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .container {
    width: min(100% - 2rem, 1040px);
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

  .tagline {
    max-width: 700px;
    margin: 0.4rem auto 0;
    color: #d5dfef;
    font-size: clamp(1.05rem, 1.6vw, 1.3rem);
    font-weight: 400;
    line-height: 1.7;
    text-wrap: pretty;
  }

  .avatar {
    width: clamp(152px, 18vw, 210px);
    height: clamp(152px, 18vw, 210px);
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
    width: min(100%, 860px);
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

  .ai-disclosure {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    width: min(100%, 860px);
    margin: 1rem auto 0;
    padding: 0.85rem 1rem;
    border: 1px solid rgba(169, 223, 242, 0.14);
    border-radius: 12px;
    color: #b9c8dc;
    font-size: 0.84rem;
    line-height: 1.55;
    text-align: left;
    background: rgba(169, 223, 242, 0.05);
  }

  .ai-disclosure p {
    margin: 0;
  }

  .disclosure-icon {
    margin-top: 0.05rem;
    color: #81e6ee;
    font-size: 1rem;
  }

  .about-section {
    width: min(100%, 760px);
    margin: clamp(3rem, 7vw, 5rem) auto 0;
    padding: 1.75rem;
    border: 1px solid rgba(173, 216, 230, 0.12);
    border-radius: 18px;
    text-align: left;
    background: rgba(255, 255, 255, 0.035);
  }

  .about-section h2 {
    margin: 0;
    color: #f8fafc;
    font-size: clamp(1.35rem, 2.3vw, 1.7rem);
    letter-spacing: -0.02em;
  }

  .about-section p {
    max-width: 680px;
    margin: 0.85rem 0 0;
    color: #c8d4e5;
    line-height: 1.65;
  }

  .topic-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-top: 1.25rem;
  }

  .topic-list span {
    padding: 0.48rem 0.72rem;
    border: 1px solid rgba(169, 223, 242, 0.18);
    border-radius: 999px;
    color: #ccecf5;
    font-size: 0.84rem;
    background: rgba(169, 223, 242, 0.06);
  }

  .footer {
    width: min(100% - 2rem, 1040px);
    margin: 0 auto;
    padding: 2.25rem 0 2.5rem;
    color: #aebbd0;
    font-size: 0.9rem;
    text-align: center;
  }

  .footer p {
    margin: 0;
  }

  .technology-credit {
    color: #91a1b9;
    font-size: 0.8rem;
  }

  .footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.55rem 1rem;
    margin: 0.85rem 0;
  }

  .footer a {
    color: #b5edf7;
    font-weight: 650;
    text-underline-offset: 3px;
  }

  .footer a:hover {
    color: #ffffff;
  }

  .creator-credit {
    font-size: 0.86rem;
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
      width: min(100% - 1.25rem, 1040px);
      padding-top: 2.25rem;
    }

    h1 {
      font-size: clamp(2.35rem, 13vw, 3.6rem);
      letter-spacing: -0.045em;
    }

    .tagline {
      font-size: 1.02rem;
      line-height: 1.65;
    }

    .about-section {
      padding: 1.25rem;
    }

    .ai-disclosure {
      padding: 0.8rem 0.9rem;
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