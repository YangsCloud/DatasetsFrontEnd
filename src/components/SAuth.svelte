<script>
  import { onMount } from "svelte";
  import { getUserInfo } from "../libs/auth.svelte"

  let isAuthed;
  let userInfo;
  onMount( async () => {
    ({isAuthed, userInfo} = await getUserInfo());
  });
</script>

{#if isAuthed}
  <slot name="myinfo" />
{:else}
  <slot name="signin" />
{/if}