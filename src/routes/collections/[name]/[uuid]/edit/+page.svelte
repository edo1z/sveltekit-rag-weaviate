<script lang="ts">
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";

  let { data } = $props<{ data: PageData }>();

  // プロパティセットの管理
  type PropertySet = {
    property: string;
    value: string;
  };

  // 初期プロパティセットを作成
  let propertySets = $state<PropertySet[]>(
    Object.entries(data.properties).map(([property, value]) => ({
      property,
      value: value as string,
    }))
  );

  // セットを追加
  function addPropertySet() {
    propertySets = [...propertySets, { property: "", value: "" }];
  }

  // セットを削除
  function removePropertySet(index: number) {
    propertySets = propertySets.filter((_, i) => i !== index);
  }
</script>

<div class="mb-4">
  <a href="/collections/{data.name}" class="text-blue-500 hover:underline">
    &lt;&nbsp;戻る
  </a>
</div>

<h1 class="text-2xl font-bold mb-4">データの編集</h1>
<p class="text-sm text-gray-500 mb-4">UUID: {data.uuid}</p>

<form
  method="POST"
  action="?/update"
  use:enhance={() => {
    return async ({ result }) => {
      if (result.type === "success") {
        const data = result.data;
        if (data.success) {
          window.location.href = `/collections/${data.name}`;
        }
      }
    };
  }}
>
  <div class="space-y-4">
    {#each propertySets as set, i}
      <div class="flex gap-4 items-center">
        <div class="flex-1">
          <input
            type="text"
            name="property_{i}"
            class="w-full border rounded p-2"
            placeholder="プロパティ名"
            bind:value={set.property}
          />
        </div>
        <div class="flex-1">
          <input
            type="text"
            name="value_{i}"
            class="w-full border rounded p-2"
            placeholder="値"
            bind:value={set.value}
          />
        </div>
        <button
          type="button"
          class="text-red-500"
          on:click={() => removePropertySet(i)}
        >
          ✕
        </button>
      </div>
    {/each}
  </div>

  <div class="mt-4 flex gap-4">
    <button
      type="button"
      class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
      on:click={addPropertySet}
    >
      ＋ プロパティを追加
    </button>

    <div class="flex-1"></div>

    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      保存
    </button>
  </div>
</form>
