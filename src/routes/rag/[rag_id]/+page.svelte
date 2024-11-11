<script lang="ts">
  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();
</script>

<div class="mb-4">
  <a href="/rag" class="text-blue-500 hover:underline"> &lt;&nbsp;戻る </a>
</div>

<h1 class="text-2xl font-bold mb-4">RAG詳細</h1>

<div class="bg-white p-6 rounded-lg shadow-md">
  <h2 class="text-xl font-bold mb-2">{data.rag.name}</h2>
  {#if data.rag.description}
    <p class="text-gray-600 mb-4">{data.rag.description}</p>
  {/if}
  <div class="text-sm text-gray-500 mb-4">
    作成日: {new Date(data.rag.createdAt).toLocaleString()}
  </div>
</div>
