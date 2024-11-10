<script lang="ts">
  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();
  console.log(data);
</script>

<h1 class="text-2xl font-bold mb-4">Collections</h1>

{#if data.collections.length === 0}
  <p>No collections found.</p>
{:else}
  <ul class="space-y-2">
    {#each data.collections as collection}
      <li class="p-4 bg-white shadow rounded">
        <h2 class="font-bold">{collection.class}</h2>
        <p class="text-sm text-gray-600">
          {collection.name || "No name"}
        </p>
      </li>
    {/each}
  </ul>
{/if}
