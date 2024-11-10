<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class='p-3 bg-gray-300'>
  <a href="/" class="hover:text-gray-600">Rag-1</a>
</div>
<div class='p-6'>
{@render children()}
</div>
