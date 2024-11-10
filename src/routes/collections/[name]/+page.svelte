<script lang="ts">
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();
  let showVectors = false;
</script>

<h1 class="text-2xl font-bold mb-4">{data.name}コレクション</h1>

<button
  class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  on:click={() => showVectors = !showVectors}
>
  {showVectors ? 'ベクトルを隠す' : 'ベクトルを表示'}
</button>

{#if data.items.length === 0}
  <p>No items found.</p>
{:else}
  <div class="space-y-4">
    {#each data.items as item}
      <div class="p-4 bg-white shadow rounded">
        <div class="font-bold text-sm text-gray-500 mb-2">UUID: {item.uuid}</div>
        <div class="mb-4">
          {#each Object.entries(item.properties) as [key, value]}
            <div class="mb-2">
              <span class="font-semibold">{key}:</span> {value}
            </div>
          {/each}
        </div>
        {#if showVectors}
          <div class="mt-2 p-2 bg-gray-50 rounded">
            <div class="font-semibold mb-1">Vectors:</div>
            <div class="text-sm font-mono overflow-x-auto">
              {JSON.stringify(item.vectors, null, 2)}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}
