<script lang="ts">
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";

  let { data } = $props<{ data: PageData }>();
  let showModal = $state(false);

  // プロパティセットの管理
  type PropertySet = {
    property: string;
    value: string;
  };

  console.log(data.items);

  // 初期プロパティセットを作成
  let propertySets = $state<PropertySet[]>([{ property: "", value: "" }]);

  // セットを追加
  function addPropertySet() {
    propertySets = [...propertySets, { property: "", value: "" }];
  }

  // セットを削除
  function removePropertySet(index: number) {
    propertySets = propertySets.filter((_, i) => i !== index);
  }
</script>

<h1 class="text-2xl font-bold mb-4">{data.name}コレクション</h1>

<div class="my-4 flex gap-4">
  <a
    href="/collections/{data.name}/search"
    class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
  >
    検索
  </a>
  <button
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    on:click={() => (showModal = true)}
  >
    データの追加
  </button>
</div>

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

<!-- モーダル -->
{#if showModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg w-full max-w-2xl">
      <h2 class="text-xl font-bold mb-4">新規データの追加</h2>

      <form
        method="POST"
        action="?/addItem"
        use:enhance={() => {
          return async ({ result }) => {
            if (result.type === "success") {
              showModal = false;
              // ページをリロードしてデータを更新
              window.location.reload();
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
              {#if propertySets.length > 1}
                <button
                  type="button"
                  class="text-red-500"
                  on:click={() => removePropertySet(i)}
                >
                  ✕
                </button>
              {/if}
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
            type="button"
            class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            on:click={() => (showModal = false)}
          >
            キャンセル
          </button>

          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
