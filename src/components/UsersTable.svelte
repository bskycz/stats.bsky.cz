
<script>
    import { loadData, richText, getAvatarUrl, getUser } from '../lib'
    import numbro from "numbro"

    const { users, prefix } = $props()
</script>

{#snippet changeDiff (diff)}
  {#if diff !== null}
  <div class="opacity-50 mt-0.5 text-xs">
    {#if diff > 0}<span class="text-green-500">▲ {(Math.abs(diff))}</span>
    {:else if diff < 0}<span class="text-red-500">▼ {(Math.abs(diff))}</span>
    {:else}{(Math.abs(diff))}{(Math.abs(udiff))}{/if}
  </div>
  {/if}
{/snippet}

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
      </tr>
    </thead>
    <tbody>
      {#each users as user, i}
        <tr class:opacity-100={!prefix && user.lastPostDiff > 60} class="hover">
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
            <div class:opacity-50={!prefix && user.lastPostDiff > 60}>
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
            {#if !prefix && user.lastPostDiff > 60}
              <div class="badge badge-outline text-xs mt-1">Poslední příspěvek před {user.lastPostDiff} dny</div>
            {/if}
          </td>
          <td class="text-center">
            <div class="text-center">{user.followers}</div>
            {@render changeDiff(user.followersWeek)}
          </td>
          <td class="text-center">
            <div class="text-center">{user.localPosts}{#if prefix && user.posts !== user.localPosts}<div class="text-xs">({user.posts})</div>{/if}</div>
            {@render changeDiff(user.localPostsWeek)}
          </td>
          <td>
            <div>
              <div class="text-xs flex gap-1 items-center" title={user.replyCountSum}>
                <svg fill="none" width="14" viewBox="0 0 24 24" height="14" style="color: rgb(120, 142, 165); pointer-events: none;"><path fill="hsl(211, 20%, 56%)" fill-rule="evenodd" clip-rule="evenodd" d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z"></path></svg>
                {numbro(user.replyCountSum || 0).format({ average: true, optionalMantissa: true, mantissa: 1 })}
              </div>
              <div class="text-xs flex gap-1 items-center" title={user.repostCountSum}>
                <svg fill="none" width="14" viewBox="0 0 24 24" height="14" style="color: rgb(120, 142, 165);"><path fill="hsl(211, 20%, 56%)" fill-rule="evenodd" clip-rule="evenodd" d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z"></path></svg>
                {numbro(user.repostCountSum || 0).format({ average: true, optionalMantissa: true, mantissa: 1 })}
              </div>
              <div class="text-xs flex gap-1 items-center" title={user.likeCountSum}>
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
        </tr>
      {/each}
    </tbody>
</table>