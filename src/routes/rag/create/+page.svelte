<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();
  let name = $state("");
  let description = $state("");
  let promptForQuery = $state("");
  let promptForResult = $state("");

  // プレビュー用の状態
  let selectedCollection = $state("");
  let question = $state("");
  let answer = $state("");
  let isLoading = $state(false);
  let error = $state("");

  async function handlePreview() {
    if (!selectedCollection || !question || !promptForQuery || !promptForResult) {
      error = "必要な項目を全て入力してください";
      return;
    }

    isLoading = true;
    error = "";
    answer = "";

    try {
      const response = await fetch("?/preview", {
        method: "POST",
        body: JSON.stringify({
          collection: selectedCollection,
          question,
          promptForQuery,
          promptForResult
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();
      if (result.error) {
        error = result.error;
      } else {
        answer = result.answer;
      }
    } catch (e) {
      error = "プレビューの実行中にエラーが発生しました";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="mb-4">
  <a href="/rag" class="text-blue-500 hover:underline">
    &lt;&nbsp;戻る
  </a>
</div>

<h1 class="text-2xl font-bold mb-4">新規RAG作成</h1>

<div class="flex gap-8">
  <!-- 左側：作成フォーム -->
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
    class="flex-1 max-w-2xl space-y-6"
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

  <!-- 右側：プレビュー -->
  <div class="flex-1 max-w-2xl space-y-6">
    <h2 class="text-xl font-bold">プレビュー</h2>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        コレクション
        <span class="text-red-500">*</span>
      </label>
      <select
        bind:value={selectedCollection}
        class="w-full border rounded p-2"
        required
      >
        <option value="">選択してください</option>
        {#each data.collections as collection}
          <option value={collection.name}>{collection.name}</option>
        {/each}
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        質問
        <span class="text-red-500">*</span>
      </label>
      <textarea
        bind:value={question}
        required
        class="w-full border rounded p-2 h-32"
      />
    </div>

    <div>
      <button
        type="button"
        on:click={handlePreview}
        disabled={isLoading}
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {isLoading ? "処理中..." : "プレビュー実行"}
      </button>
    </div>

    {#if error}
      <div class="text-red-500">{error}</div>
    {/if}

    {#if answer}
      <div class="bg-gray-50 p-4 rounded">
        <h3 class="font-bold mb-2">回答</h3>
        <p class="whitespace-pre-wrap">{answer}</p>
      </div>
    {/if}
  </div>
</div>
