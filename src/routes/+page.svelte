<script>

  import { onMount } from "svelte"
  import { format } from "date-fns";
  import { cs } from "date-fns/locale";
  import Chart from '../components/Chart.svelte'
  import UsersTable from "../components/UsersTable.svelte"
  import { loadData, getAvatarUrl, getUser } from '../lib'

  let data = $state(null)

  function lastPostDiff(u) {
    const diffTime = Math.abs(Date.now() - new Date(u.lastPostDate));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  onMount(async () => {
    const d = await loadData()
    if (d && Array.isArray(d.users)) {
      d.users = d.users.map(u => {
        if (u.included || u.czechNational) {
          u.lastPostDiff = lastPostDiff(u)
        }
        return u
      })
    }
    data = d
  })

  let offset = $state(0)
  let limit = $state(100)

  const users = $derived(data && data.users
    .filter((u) => u.included)
    .sort((x, y) => (y.followers > x.followers ? 1 : -1)))

  const usersExpats = $derived(data && data.users
    .filter((u) => !u.included && u.czechNational && !u.optout && !u.deleted && !u.redacted)
    .sort((x, y) => (y.followers > x.followers ? 1 : -1)))

  let durationSelected = $state("day")
  const durationOptions = [
    ["24 hodin", "day"],
    ["týden", "week"],
    ["měsíc", "month"],
  ]

</script>

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
      {u.handle.replace(/\.bsky\.social$/, '')}{#if u.handle.match(/\.bsky\.social$/)}<span class="opacity-75 font-normal">.bsky.social</span>{/if}
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
          {@render statsPaneUser(i, s, getUser(users, s.did))}
        </div>
      {/each}
    </div>
</div>
{/snippet}

{#if data}
<div class="flex w-full mt-10 mb-10 gap-10">

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

<div id="base" class="mt-10 flex gap-4 items-center mb-4">
  <h2 class="text-2xl">
    Uživatelé píšící česky ({users.length})
  </h2>
  <a href="#expats" class="btn btn-sm btn-ghost">Další čeští uživatelé ({usersExpats.length})</a>
</div>
<UsersTable {users} />

<div class="prose">
  <p>Podmínky pro zařazení do seznamu:</p>
  <ul>
    <li>Uživatel musí mít alespoň 5 příspěvků v českém jazyce</li>
    <li>Více než 25% všech příspěvků uživatele musí být v češtině</li>
  </ul>
</div>

<div id="expats" class="mt-10 flex gap-4 items-center mb-4">
  <h2 class="text-2xl">
    Další čeští uživatelé ({usersExpats.length})
  </h2>
  <a href="#base" class="btn btn-sm btn-ghost">Uživatelé píšící česky ({users.length})</a>
</div>
<div class="mb-4 opacity-50">Uživatelé českého původu, kteří nesplňují podmínky pro zařazení do hlavního seznamu. Tito uživatelé se nezapočítávají do statistik výše.</div>

<UsersTable users={usersExpats} prefix="x" />

<div class="mb-6 opacity-50 text-sm">
  Naposledy aktualizováno: {format(new Date(data.time), "PPPPpppp", { locale: cs })} (<a href="https://data.bsky.cz" class="hover:underline">data.bsky.cz</a>)
</div>

{:else}
  <div class="w-full h-[70vh] flex items-center justify-center mt-10">
    <div class="text-center">
      <div class="loading loading-dots loading-lg" style="width:75px; height: 75px;"></div>
      <div>Načítám data ..</div>
    </div>
  </div>
{/if}

<div class="mt-10"></div>

<style>
  .user-table tbody tr {
    @apply hover:bg-blue-100;
  }
  
</style>
