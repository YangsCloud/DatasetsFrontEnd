<script>
  export let title = 'This Page Is Under Construction';
  export let author = 'Unknown';
  export let created_datetime = 'Not Available';
  export let updated_datetime = 'Not Available';
</script>

<h1 class="text-4xl mb-3 lg:text-5xl font-bold lg:tracking-tight mt-1 lg:leading-tight dark:text-white">
  {title}
</h1>
<div class="flex items-center justify-center gap-2 mt-6 items-center flex-wrap md:flex-nowrap text-sm text-neutral-500 grid-cols-1 md:grid-cols-2">
  <div class="flex items-center justify-center gap-2">
    <span class="font-semibold text-xs">Created By:</span>
    <span>
      {author}
    </span>
  </div>
</div>
<div class="flex items-center justify-center gap-2 mt-2 items-center flex-wrap md:flex-nowrap text-sm text-neutral-500 grid-cols-1 md:grid-cols-2">
  <div class="flex items-center justify-center gap-2">
    <span class="font-semibold text-xs">Create At:</span>
    <time datetime={created_datetime}>
    {created_datetime}
    </time>
  </div>
  {#if updated_datetime}
    <div class="flex items-center justify-center gap-2">
      <span class="hidden md:block">•</span>
      <span class="font-semibold text-xs">Update At:</span>
      <time datetime={updated_datetime}>
      {updated_datetime}
      </time>
    </div>
  {/if}
</div>
