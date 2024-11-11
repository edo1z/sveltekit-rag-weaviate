<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';

	let { data, children } = $props<{ data: LayoutData }>();
</script>

<div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
	<div class="container mx-auto px-4">
		<div class="flex justify-between items-center h-14">
			<a
				href="/"
				class="text-xl font-bold tracking-wider hover:text-blue-400 transition-colors"
			>
				RAG
			</a>

			{#if data.user}
				<div class="flex items-center gap-6">
					<span class="text-gray-300">{data.user.username}</span>
					<form method="POST" action="/logout">
						<button
							class="
								px-4 py-2
								text-sm font-medium
								text-gray-300 hover:text-white
								hover:bg-gray-700
								rounded-md
								transition-colors
							"
						>
							ログアウト
						</button>
					</form>
				</div>
			{:else}
				<a
					href="/login"
					class="
						px-4 py-2
						text-sm font-medium
						text-gray-300 hover:text-white
						hover:bg-gray-700
						rounded-md
						transition-colors
					"
				>
					ログイン
				</a>
			{/if}
		</div>
	</div>
</div>

<div class="p-6">
	{@render children()}
</div>
