<script lang="ts">
  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();
</script>

<div class="mb-8">
  <h1 class="text-2xl font-bold mb-4">RAG一覧</h1>
  <a
    href="/rag/create"
    class="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
    新規RAG作成
  </a>
</div>

{#if data.rags.length === 0}
  <p>RAGデータがありません。</p>
{:else}
  <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each data.rags as rag}
      <a href="/rag/{rag.id}" class="block">
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 class="text-xl font-bold mb-2">{rag.name}</h2>
          {#if rag.description}
            <p class="text-gray-600 mb-4">{rag.description}</p>
          {/if}
          <div class="text-sm text-gray-500">
            作成日: {new Date(rag.createdAt).toLocaleString()}
          </div>
        </div>
      </a>
    {/each}
  </div>
{/if}
