<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';

	let { data, children } = $props<{ data: LayoutData }>();
</script>

<div class="p-3 bg-gray-300 flex justify-between items-center">
	<a href="/" class="hover:text-gray-600">Rag-1</a>
	{#if data.user}
		<div class="flex gap-4 items-center">
			<span>{data.user.username}</span>
			<form method="POST" action="/mypage?/logout">
				<button class="text-sm text-gray-600 hover:text-gray-800">
					ログアウト
				</button>
			</form>
		</div>
	{:else}
		<a href="/login" class="text-sm text-gray-600 hover:text-gray-800">
			ログイン
		</a>
	{/if}
</div>

<div class="p-6">
	{@render children()}
</div>
