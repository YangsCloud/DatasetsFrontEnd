<script>
  import { onMount } from "svelte";
  import { readItems } from "@directus/sdk";
  import { getDirectusInstance } from "../libs/client.svelte";

  let homeFeatures = [];

  onMount( async () => {
    const client = getDirectusInstance(false);
    homeFeatures = await client.request(
      readItems('HomeFeatures',
        {
          limit: -1,
          fields: ['status', 'title', 'description']
        }
      )
    );
  });
</script>


{#if homeFeatures.length}
  {#each homeFeatures as homeFeature}
    {#if homeFeature["publish"]}
      <div class="flex flex-col content-center shadow-neutral-600 dark:border-neutral-700 dark:shadow-neutral-500">
        <dt class="flex items-center pt-1 pb-1 pl-3 gap-x-2 text-base font-semibold leading-7 text-black dark:text-white">
          <span class="relative flex h-3 w-3 items-center justify-center">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
          </span>
          {homeFeature["title"]}
        </dt>
        <dd class="pt-1 pb-1 px-3 flex flex-auto flex-col text-base leading-7 text-gray-900 dark:text-gray-100">
          <p class="flex-auto text-left">
            {homeFeature["description"]}
          </p>
        </dd>
      </div>
    {/if}
  {/each}
{/if}