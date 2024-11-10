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
      <li class="p-4 bg-white shadow rounded hover:bg-gray-50 cursor-pointer">
        <a href="/collections/{collection.name}" class="block">
          <h2 class="font-bold">{collection.name}</h2>
          <p class="text-sm text-gray-600">
            {collection.description || "No description"}
          </p>
        </a>
      </li>
    {/each}
  </ul>
{/if}
