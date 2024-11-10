<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class='p-3 bg-gray-300'>Rag-1</div>
<div class='p-6'>
{@render children()}
</div>
