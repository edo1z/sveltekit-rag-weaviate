<script lang="ts">
  import { enhance } from "$app/forms";

  let name = $state("");
  let description = $state("");
  let promptForQuery = $state("");
  let promptForResult = $state("");
</script>

<div class="mb-4">
  <a href="/rag" class="text-blue-500 hover:underline">
    &lt;&nbsp;戻る
  </a>
</div>

<h1 class="text-2xl font-bold mb-4">新規RAG作成</h1>

<form
  method="POST"
  action="?/create"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === "success") {
        window.location.href = "/rag";
      }
    };
  }}
  class="max-w-2xl space-y-6"
>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      名前
      <span class="text-red-500">*</span>
    </label>
    <input
      type="text"
      name="name"
      bind:value={name}
      required
      class="w-full border rounded p-2"
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      説明
    </label>
    <textarea
      name="description"
      bind:value={description}
      class="w-full border rounded p-2 h-24"
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      クエリ用プロンプト
      <span class="text-red-500">*</span>
    </label>
    <textarea
      name="promptForQuery"
      bind:value={promptForQuery}
      required
      class="w-full border rounded p-2 h-32"
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      結果用プロンプト
      <span class="text-red-500">*</span>
    </label>
    <textarea
      name="promptForResult"
      bind:value={promptForResult}
      required
      class="w-full border rounded p-2 h-32"
    />
  </div>

  <div class="flex justify-end">
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      作成
    </button>
  </div>
</form>
