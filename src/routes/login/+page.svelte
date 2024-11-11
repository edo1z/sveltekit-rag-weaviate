<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="max-w-md mx-auto mt-8">
	<h1 class="text-2xl font-bold text-gray-900 mb-8">
		アカウント作成 / ログイン
	</h1>

	<form method='post' action='?/login' use:enhance class="space-y-6">
		<div class="space-y-4">
			<div>
				<label for="username" class="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
				<input
					id="username"
					name="username"
					type="text"
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					placeholder="ユーザー名を入力"
				/>
			</div>
			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					placeholder="パスワードを入力"
				/>
			</div>
		</div>

		<div class="flex gap-4">
			<button
				type="submit"
				class="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				ログイン
			</button>
			<button
				formaction="?/register"
				class="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
			>
				新規登録
			</button>
		</div>
	</form>

	{#if form?.message}
		<div class="mt-4 text-sm text-center text-red-600">
			{form.message}
		</div>
	{/if}
</div>
