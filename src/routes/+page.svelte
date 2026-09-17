<script>
  import Chat from '$lib/components/Chat.svelte';
</script>


<div class="flex flex-col min-h-screen">
    <div class="container flex-grow flex items-center justify-center">
        <main>
            <h1>Welcome to <span>AWS Playground</span></h1>
            <p>
                The fastest way to build high-performance web applications. 
                Ready to dive in?
            </p>

            <img class="avatar" src="/Lorelynn.png" alt="Lorelyn" />

            <div class="badge">Chat with Lorelyn</div>

           <Chat />
                    
        </main>
    </div>
    </div>

   <footer class="footer mt-auto py-12 text-sm">
    <p style="text-align: center; color: #94a3b8;">
        &copy; {new Date().getFullYear()} | Built by
        <a
            href="https://uspekhi.web.app"
            target="_blank"
            rel="noopener"
            aria-label="USPEKHI Web Development"
            style="color: #FAEBD7;"
            class="font-semibold transition-opacity hover:opacity-80 underline ml-1 inline-block"
        >
            USPEKHI
        </a>
    </p>
</footer>



<style>
    :global(body) {
        margin: 0;
        font-family: 'Inter', -apple-system, sans-serif;
        background: radial-gradient(circle at top left, #ff3e0015, transparent),
                    radial-gradient(circle at bottom right, #40b3ff15, transparent);
        background-color: #0f172a;
        color: #f8fafc;
        /* Removed fixed height/flex from body to allow full page scrolling and proper footer placement */
        min-height: 100vh;
        padding-bottom: 160px; /* Accounts for the fixed bottom navigation bar and footer height */
    }

    .container {
        text-align: center;
        padding: 2rem;
        width: 100%;
        box-sizing: border-box;
    }

    .avatar {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        margin: 0 auto 1rem;
        display: block;
        object-fit: cover;
        border: 2px solid #00ffff;
        background-color: #0B0D17;
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
    }

    h1 {
        font-size: clamp(2.5rem, 8vw, 4rem);
        margin: 0 0 1rem 0;
        line-height: 1.1;
    }

    p {
        font-size: 1.2rem;
        color: #94a3b8;
        max-width: 500px;
        margin: 0 auto 2.5rem auto;
    }

    .footer {
        text-align: center;
        padding: 2rem;
        }
</style>