<script>
  import "../app.css";
</script>

<svelte:head>
  <title>Bluesky Česko 🇨🇿</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <div class="flex items-center mt-6">
    <h1 class="text-3xl grow">🦋 Bluesky Česko 🇨🇿</h1>
    <div class="text-lg flex gap-6">
      <div>
        🦋 <a href="https://bsky.app/profile/bsky.cz" class="hover:underline"
          >@bsky.cz</a
        >
      </div>
      <div>
        𝕏 <a href="https://x.com/bskyczech" class="hover:underline"
          >@bskyczech</a
        >
      </div>
      <div>
        <label class="swap swap-rotate">
          <!-- this hidden checkbox controls the state -->
          <input type="checkbox" class="theme-controller" value="light" />

          <!-- sun icon -->
          <svg
            class="swap-off h-7 w-7 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
            />
          </svg>

          <!-- moon icon -->
          <svg
            class="swap-on h-7 w-7 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
            />
          </svg>
        </label>
      </div>
    </div>
  </div>

  <div class="">
    <slot />
  </div>

  <footer class="footer flex bg-blue-500/20 p-10">
    <aside class="w-1/2">
      <p class="text-lg">🦋 Bluesky Česko 🇨🇿</p>
      <p class="text-xs opacity-75">
        Česká komunita příznivců AT Protocol/Bluesky. Spojujeme místní nadšence,
        servírujeme čerstvé novinky s knedlíkem a sdílíme tipy pro lepší Bluesky
        zážitek. Ptejte se, diskutujte, buďte součástí!
      </p>
      <p class="opacity-75">
        <br />
        Web vytvořil
        <a
          href="https://bsky.cz/profile/tree.fail"
          class="underline hover:no-underline">@tree.fail</a
        >
        🌴 pomocí
        <a href="https://svelte.dev/" class="underline hover:no-underline"
          >Svelte</a
        >
        <img src="/svelte.svg" class="h-5 mx-0.5 inline-block" />
        (<a
          href="https://github.com/burningtree/bsky-cz-web"
          class="underline hover:no-underline">zdrojový kód</a
        >)
      </p>
    </aside>
    <nav class="grow">
      <h6 class="footer-title">Sociální sítě</h6>
      <div class="grid grid-flow-col gap-4">
        <a
          href="https://bsky.app/profile/bsky.cz"
          class="hover:underline text-xl">🦋</a
        >
        <a href="https://x.com/bskyczech">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            class="fill-current"
          >
            <path
              d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
            ></path>
          </svg>
        </a>
      </div>
    </nav>
  </footer>
</div>
