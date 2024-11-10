<script lang="ts">
  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();
</script>

<h1 class="text-2xl font-bold mb-4">{data.name}コレクション</h1>

{#if data.items.length === 0}
  <p>No items found.</p>
{:else}
  <div class="space-y-4">
    {#each data.items as item}
      <div class="p-4 bg-white shadow rounded">
        <div class="font-bold text-sm text-gray-500 mb-2">
          UUID: {item.uuid}
        </div>
        <div class="mb-4">
          {#each Object.entries(item.properties) as [key, value]}
            <div class="mb-2">
              <span class="font-semibold">{key}:</span>
              {value}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
{/if}
