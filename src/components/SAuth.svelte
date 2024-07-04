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
  <div>
    Welcome, {userInfo["external_identifier"]}!
  </div>
  <slot name="logout" />
{:else}
  <slot name="signin" />
{/if}