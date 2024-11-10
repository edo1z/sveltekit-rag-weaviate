<script lang="ts">
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";

  let { data } = $props<{ data: PageData }>();
  let searchQuery = $state("");
  let searchResults = $state([]);
  let searchError = $state("");
</script>

<div class="mb-4">
  <a href="/collections/{data.name}" class="text-blue-500 hover:underline">
    &lt;&nbsp;戻る
  </a>
</div>

<h1 class="text-2xl font-bold mb-4">
  {data.name}コレクションのセマンティック検索
</h1>

<form
  method="POST"
  action="?/search"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === "success") {
        const data = result.data;
        if (data.success) {
          searchResults = data.results;
          searchError = "";
        } else {
          searchError = data.error;
          searchResults = [];
        }
      }
    };
  }}
  class="mb-8"
>
  <div class="flex gap-4">
    <input
      type="text"
      name="query"
      bind:value={searchQuery}
      placeholder="検索キーワードを入力"
      class="flex-1 border rounded p-2"
    />
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      検索
    </button>
  </div>
</form>

{#if searchError}
  <p class="text-red-500 mb-4">{searchError}</p>
{/if}

{#if searchResults.length > 0}
  <div class="space-y-4">
    {#each searchResults as result}
      <div class="p-4 bg-white shadow rounded">
        <div class="font-bold text-sm text-gray-500 mb-2">
          UUID: {result.uuid}
          <span class="ml-4">類似度: {(result.score * 100).toFixed(2)}%</span>
        </div>
        <div class="mb-4">
          {#each Object.entries(result.properties) as [key, value]}
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
