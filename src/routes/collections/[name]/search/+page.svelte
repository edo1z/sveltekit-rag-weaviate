<script lang="ts">
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";

  let { data } = $props<{ data: PageData }>();
  let searchQuery = $state("");
</script>

<h1 class="text-2xl font-bold mb-4">{data.name}コレクションのセマンティック検索</h1>

<form method="POST" action="?/search" use:enhance class="mb-8">
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
