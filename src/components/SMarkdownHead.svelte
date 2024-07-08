<script>
  export let title;
  export let create_author;
  export let update_author;
  export let create_datetime;
  export let update_datetime;
</script>

<h1 class="text-4xl mb-3 lg:text-5xl font-bold lg:tracking-tight mt-1 lg:leading-tight dark:text-white">
  {title}
</h1>
<div class="flex items-center justify-center gap-2 mt-6 items-center flex-wrap md:flex-nowrap text-sm text-neutral-500 grid-cols-1 md:grid-cols-2">
  <div class="flex items-center justify-center gap-2">
    <span class="font-semibold text-xs">Created By:</span>
    <span>
      {create_author}
    </span>
  </div>
  {#if update_author}
    <div class="flex items-center justify-center gap-2">
      <span class="hidden md:block">•</span>
      <span class="font-semibold text-xs">Updated By:</span>
      <span>
        {update_author}
      </span>
    </div>
  {/if}
</div>
<div class="flex items-center justify-center gap-2 mt-2 items-center flex-wrap md:flex-nowrap text-sm text-neutral-500 grid-cols-1 md:grid-cols-2">
  <div class="flex items-center justify-center gap-2">
    <span class="font-semibold text-xs">Create At:</span>
    <time datetime={create_datetime}>
    {create_datetime}
    </time>
  </div>
  {#if update_datetime}
    <div class="flex items-center justify-center gap-2">
      <span class="hidden md:block">•</span>
      <span class="font-semibold text-xs">Update At:</span>
      <time datetime={update_datetime}>
      {update_datetime}
      </time>
    </div>
  {/if}
</div>
