<script>
  import { onMount } from "svelte";
  import { checkAuth } from "../libs/auth.svelte"

  export let isAuthed = false;
  export let userInfo = null;
  onMount( async () => {
    ({isAuthed, userInfo} = await checkAuth());
  });
</script>

{#if isAuthed}
  <slot name="myinfo" />
{:else}
  <slot name="signin" />
{/if}