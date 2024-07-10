<script>

  import { formatDistanceToNow } from "date-fns";
  import { cs } from "date-fns/locale";
  import numbro from "numbro";
  import { BarChartSimple, LineChart, HistogramChart, ComboChart, AreaChart } from '@carbon/charts-svelte'
  import '@carbon/charts-svelte/styles.css'
  import Chart from '../components/Chart.svelte'
  import { loadData } from '../lib'
  import { onMount } from "svelte";
  import { use } from "echarts";

  let data = $state(null)

  onMount(async () => {
    data = await loadData()
  })

  let offset = $state(0)
  let limit = $state(100)

  const users = $derived(data && data.users
    .filter((u) => u.included)
    .sort((x, y) => (y.followers > x.followers ? 1 : -1)))

  const usersExpats = $derived(data && data.users
    .filter((u) => !u.included && u.czechNational && !u.optout && !u.deleted && !u.redacted)
    .sort((x, y) => (y.followers > x.followers ? 1 : -1)))

  function lastPostDiff(u) {
    const diffTime = Math.abs(Date.now() - new Date(u.lastPostDate));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  function getAvatarUrl(u) {
    return u.avatar ? `https://data.bsky.cz/avatars/thumb/${u.did}.avif` : "/avatar.jpg";
  }
  function getUser(did) {
    return users.find(u => u.did === did)
  }

  let durationSelected = $state("day")
  const durationOptions = [
    ["24 hodin", "day"],
    ["týden", "week"],
    ["měsíc", "month"],
  ]

  function richText(text, maxLength = 50) {
    // Regex for URLs (with or without http/https, including those with hash)
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z0-9()]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    
    // Regex for Bluesky mentions (e.g., @username.domain)
    const blueskyMentionRegex = /@([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+)/g;
    
    // Regex for X mentions (e.g., @username without a dot)
    const xMentionRegex = /@([a-zA-Z0-9_]+)(?![._-])/g;
    
    // Regex for Fediverse mentions (e.g., @username@instance.com)
    const fediverseMentionRegex = /@?([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;

    // Regex for hashtags (includes Unicode characters)
    const hashtagRegex = /(?<!\S)#(\p{L}\p{M}*(?:\p{L}\p{M}*|[0-9_])*)/gu;

    // Array to store replaced elements
    const replacements = [];

    // Replace Fediverse mentions
    text = text.replace(fediverseMentionRegex, (match, username, instance) => {
      const replacement = `<a href="https://elk.zone/${instance}/@${username}" target="_blank" class="rtl">@${username}@${instance}</a>`;
      replacements.push({original: match, replacement: replacement});
      return `__MENTION_${replacements.length - 1}__`;
    });

    // Replace Bluesky mentions
    text = text.replace(blueskyMentionRegex, (match, handle) => {
      const replacement = `<a href="https://bsky.app/profile/${handle}" target="_blank" class="rtl">@${handle}</a>`;
      replacements.push({original: match, replacement: replacement});
      return `__MENTION_${replacements.length - 1}__`;
    });

    // First, replace URLs to protect them
    text = text.replace(urlRegex, (url) => {
      let href = url.startsWith('http') ? url : `https://${url}`;
      let displayUrl = url.replace(/https?:\/\//g, '').replace(/\/$/, '');
      if (url.length > maxLength) {
        displayUrl = url.substring(0, maxLength - 3) + '...';
      }
      const replacement = `<a href="${href}" target="_blank" class="rtl">${displayUrl}</a>`;
      replacements.push({original: url, replacement: replacement});
      return `__URL_${replacements.length - 1}__`;
    });

    // Replace X mentions
    text = text.replace(xMentionRegex, (match, username) => {
      const replacement = `<a href="https://x.com/${username}" target="_blank" class="rtl">@${username}</a>`;
      replacements.push({original: match, replacement: replacement});
      return `__MENTION_${replacements.length - 1}__`;
    });

    // Replace hashtags
    text = text.replace(hashtagRegex, (match, hashtag) => {
      const encodedHashtag = encodeURIComponent(hashtag);
      const replacement = `<a href="https://bsky.app/hashtag/${encodedHashtag}" target="_blank" class="rtl">#${hashtag}</a>`;
      replacements.push({original: match, replacement: replacement});
      return `__HASHTAG_${replacements.length - 1}__`;
    });

    // Restore all replacements
    replacements.forEach((item, index) => {
      text = text.replace(`__URL_${index}__`, item.replacement);
      text = text.replace(`__MENTION_${index}__`, item.replacement);
      text = text.replace(`__HASHTAG_${index}__`, item.replacement);
    });

    // Regular expression to match long strings but ignore HTML tags
    const regex = new RegExp(`(?<!<[^>]*)\\b\\S{${maxLength+1},}\\b(?![^<]*>)`, 'g');

    text = text.replace(regex, (match) => {
      return `<span style="word-break: break-all;">${match}</span>`;
    });

    return text;
  }
</script>

<!--div class="h-[400px]">
  <LineChart data={data.postStats.months.map(s => ({ group: 'příspěvky', date: s.date, value: s.count }))} options={{
    title: 'Příspěvků za měsíc',
    grid: {
      x: {
        enabled: false
      },
    },
    axes: {
      left: {
        mapsTo: 'value',
        ticks: {
          //formatter: e=>typeof e=="number"?e.toLocaleString("cs-CZ"):e.toString()
        }
      },
      bottom: {
        mapsTo: 'date',
        scaleType: 'time',
        ticks: {
          number: data.postStats.months.length,
          formatter: e=>e instanceof Date?e.toLocaleDateString("cs-CZ",{month:"short", year:"numeric"}):e.toString(),
        }
      }
  },
  height: '400px'}} style="padding:2rem;" />
</div-->

{#if data}
<div class="flex w-full mt-10 mb-10 gap-10">

  <!--div class="h-[400px]">
    <AreaChart data={data.postStats.days.map(s => ({ group: 'příspěvky', date: s.date, value: s.count }))} options={{
      title: 'Příspěvků za den (poslední měsíc)',
      grid: {
        x: {
          enabled: false
        },
      },
      axes: {
        left: {
          mapsTo: 'value',
          ticks: {
            formatter: e=>typeof e=="number"?e.toLocaleString("cs-CZ"):e.toString()
          }
        },
        bottom: {
          mapsTo: 'date',
          scaleType: 'time',
          ticks: {
            formatter: e=>e instanceof Date?e.toLocaleDateString("cs-CZ",{month:"short",day:"numeric"}):e.toString()
          }
        }
    },
    height: '400px'}} style="padding:2rem;" />
  </div-->

  {#snippet statsPaneUser(i, s, u)}
    <div class="mb-1">
      <div class="inline-block w-7 text-right">{i+1}.</div> 
      <img
      loading="lazy"
      src={getAvatarUrl(u)}
      alt={u.handle}
      class="inline-block w-8 h-8 aspect-square rounded-full shrink-0 mx-1 bg-gray-500/20"
    />
      <a href="https://bsky.app/profile/{u.handle}" class="font-semibold hover:underline" target="_blank">
          {u.handle.replace(/\.bsky\.social$/, '')}{#if u.handle.match(/\.bsky\.social$/)}<span class="opacity-50 font-normal">.bsky.social</span>{/if}
      </a> ({s.count})
    </div>
  {/snippet}

  {#snippet statsPane(type)}
    <div>
      <h3 class="text-2xl mb-2">Top přispěvatelé v češtině</h3>
      <div class="mb-4 flex gap-2">
        {#each durationOptions as d}
          <div class:font-bold={durationSelected === d[1]} class="hover:underline cursor-pointer" onclick={() => { document.getElementById("scroller-"+type).scroll({ top: 0 }); durationSelected = d[1]; }}>{d[0]}</div>
        {/each}
      </div>
      <div class="h-[356px] overflow-scroll" id="scroller-{type}">
          {#each data.stats[type]?.slice(0, 1000) as s, i}
            <div class="opacity-100 hover:opacity-100">
              {@render statsPaneUser(i, s, getUser(s.did))}
            </div>
          {/each}
        </div>
    </div>
  {/snippet}


  <div class="w-1/3">
    <div>
      {@render statsPane(durationSelected)}
    </div>
  </div>

  <div class="w-2/3">
    <div class="">
      <h3 class="text-2xl mb-4">Uživatelé</h3>
      <Chart
        type="users"
        lineData={data.userStats.map(s => ({ name: s.date, value: [s.date, s.total] }))}
        barData={data.userStats.map(s => ({ name: s.date, value: [s.date, s.count] }))}
      />
    </div>


    <div class="mt-10">
      <h3 class="text-2xl mb-4">Příspěvky</h3>
      <Chart
        type="posts"
        lineData={data.postStats.map(s => ({ name: s.date, value: [s.date, s.total] }))}
        barData={data.postStats.map(s => ({ name: s.date, value: [s.date, s.count] }))}
      />
    </div>
  </div>

</div>

{#snippet usersTable (uarr, prefix="")}
<table class="table mb-10">
  <thead>
    <tr>
      <th>Pořadí</th>
      <th>Jméno</th>
      <th></th>
      <th>Sleďů</th>
      <th>Zpráv</th>
      <th>Získáno</th>
      <th>Popis</th>
      <!--th>Založen</th-->
    </tr>
  </thead>
  <tbody>
    {#each uarr as user, i}
      <tr class:opacity-100={!prefix && lastPostDiff(user) > 60} class="hover">
        <td class="opacity-50 text-center">{prefix}{i + 1}.</td>
        <td class="shrink-0">
          <div
            class="w-12 h-12 shrink-0 rounded-full aspect-square bg-gray-500/20"
          >
            <img
              loading="lazy"
              src={getAvatarUrl(user)}
              alt={user.handle}
              class="w-12 h-12 aspect-square rounded-full shrink-0"
            />
          </div>
        </td>
        <td class="pb-2">
          <div class:opacity-50={!prefix && lastPostDiff(user) > 60}>
            <a
              href="https://bsky.app/profile/{user.handle}"
              target="_blank"
              class="hover:underline font-semibold break-word"
              >{user.displayName || user.handle}</a
            >
          </div>
          <div class="text-sm">
            <a
              href="https://clearsky.app/{user.handle}"
              target="_blank"
              class="hover:underline opacity-50">@{user.handle}</a
            >
            {#each JSON.parse(user.labels) as label}
              {#if label.val === "!no-unauthenticated"}
                <a
                  href="https://bsky.app/profile/{label.src}"
                  alt={label.val}
                  title={label.val}>🔒</a
                >
              {/if}
            {/each}
            {#if user.twitter}
              <a href="https://x.com/{user.twitter}" target="_blank">𝕏</a>
            {/if}
          </div>
          {#if !prefix && lastPostDiff(user) > 60}
            <div class="badge badge-outline text-xs mt-1">Poslední příspěvek před {lastPostDiff(user)} dny</div>
          {/if}
        </td>
        <td>
          <div class="text-center">{user.followers}</div>
        </td>
        <!--td
          ><div>{user.follows}</div>
          <div class="text-xs opacity-50">sleduje</div></td
        -->
        <td><div class="text-center">{user.localPosts}{#if prefix && user.posts !== user.localPosts}<div class="text-xs">({user.posts})</div>{/if}</div> </td>
        <td>
          <div>
            <div class="text-xs flex gap-1 items-center">
              <svg fill="none" width="14" viewBox="0 0 24 24" height="14" style="color: rgb(120, 142, 165); pointer-events: none;"><path fill="hsl(211, 20%, 56%)" fill-rule="evenodd" clip-rule="evenodd" d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z"></path></svg>
              {numbro(user.replyCountSum || 0).format({ average: true, optionalMantissa: true, mantissa: 1 })}
            </div>
            <div class="text-xs flex gap-1 items-center">
              <svg fill="none" width="14" viewBox="0 0 24 24" height="14" style="color: rgb(120, 142, 165);"><path fill="hsl(211, 20%, 56%)" fill-rule="evenodd" clip-rule="evenodd" d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z"></path></svg>
              {numbro(user.repostCountSum || 0).format({ average: true, optionalMantissa: true, mantissa: 1 })}
            </div>
            <div class="text-xs flex gap-1 items-center">
              <svg fill="none" width="14" viewBox="0 0 24 24" height="14" style="color: rgb(120, 142, 165); pointer-events: none;"><path fill="hsl(211, 20%, 56%)" fill-rule="evenodd" clip-rule="evenodd" d="M16.734 5.091c-1.238-.276-2.708.047-4.022 1.38a1 1 0 0 1-1.424 0C9.974 5.137 8.504 4.814 7.266 5.09c-1.263.282-2.379 1.206-2.92 2.556C3.33 10.18 4.252 14.84 12 19.348c7.747-4.508 8.67-9.168 7.654-11.7-.541-1.351-1.657-2.275-2.92-2.557Zm4.777 1.812c1.604 4-.494 9.69-9.022 14.47a1 1 0 0 1-.978 0C2.983 16.592.885 10.902 2.49 6.902c.779-1.942 2.414-3.334 4.342-3.764 1.697-.378 3.552.003 5.169 1.286 1.617-1.283 3.472-1.664 5.17-1.286 1.927.43 3.562 1.822 4.34 3.764Z"></path></svg>
              {numbro(user.likeCountSum || 0).format({ average: true, optionalMantissa: true, mantissa: 1 })}
            </div>
          </div>
        </td>
        <td class="text-sm break-words">
          {#if user.description === "NULL"}
            <span class="opacity-50">(bez popisu)</span>
          {:else}
            {@html richText(user.description)}
          {/if}
        </td>
        <!--td class="text-sm opacity-50">
          {user.createdAt
            ? formatDistanceToNow(new Date(user.createdAt), {
                locale: cs,
                addSuffix: true,
              })
            : "n/a"}
        </td-->
      </tr>
    {/each}
  </tbody>
</table>
{/snippet}

<div id="base" class="mt-10 flex gap-4 items-center mb-4">
  <h2 class="text-2xl">
    Uživatelé píšící česky ({users.length})
  </h2>
  <a href="#expats" class="btn btn-sm btn-ghost">Další čeští uživatelé ({usersExpats.length})</a>
</div>
{@render usersTable(users)}
<div class="prose">
  <p>Podmínky pro zařazení do seznamu:</p>
  <ul>
    <li>Uživatel musí mít alespoň 5 příspěvků v českém jazyce</li>
    <li>Více než polovina všech příspěvků uživatele musí být v češtině</li>
  </ul>
</div>

<div id="expats" class="mt-10 flex gap-4 items-center mb-4">
  <h2 class="text-2xl">
    Další čeští uživatelé ({usersExpats.length})
  </h2>
  <a href="#base" class="btn btn-sm btn-ghost">Uživatelé píšící česky ({users.length})</a>
</div>
<div class="mb-4 opacity-50">Uživatelé českého původu, kteří nesplňují podmínky pro zařazení do hlavního seznamu. Tito uživatelé se nezapočítávají do statistik výše.</div>
{@render usersTable(usersExpats, "x")}

<div class="mb-6">
  Naposledy aktualizováno: {data.time}
</div>

{:else}
  <div class="mt-10">Načítám data ..</div>
{/if}

<div class="mt-10"></div>

<style>
  .user-table tbody tr {
    @apply hover:bg-blue-100;
  }
  
</style>
