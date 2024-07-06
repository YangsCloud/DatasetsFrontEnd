<script>
  import { onMount } from "svelte";
  import { readItems } from "@directus/sdk";
  import { getDirectusInstance } from "../libs/client.svelte";

  let homeDatasets = [];

  onMount( async () => {
    const client = getDirectusInstance(false);
    homeDatasets = await client.request(
      readItems('HomeDatasets',
        {
          limit: -1,
          fields: ['status', 'title', 'description', 'route']
        }
      )
    );
  });
</script>

{#if homeDatasets}
  {#each homeDatasets as homeDataset}
    {#if homeDataset["status"] === 'published'}
      <div class="flex flex-col rounded-md border-2 border-neutral-200 shadow-md shadow-neutral-600 dark:border-neutral-700 dark:shadow-neutral-500">
        <dt class="flex items-center pt-1 pb-1 pl-3 gap-x-3 text-base font-semibold leading-7 text-black dark:text-white border-b-2 border-dashed border-neutral-300 dark:border-neutral-600">
          <span class="relative flex h-3 w-3 items-center justify-center">
            <span class="animate-pulse relative inline-flex rounded-full h-full w-full bg-amber-600"></span>
          </span>
          {homeDataset["title"]}
        </dt>
        <dd class="pt-1 pb-1 px-3 flex flex-auto flex-col text-base leading-7 text-gray-900 dark:text-gray-100">
          <p class="flex-auto text-left">
            {homeDataset["description"]}
          </p>
          <p class="flex pt-5 pb-1 justify-end">
            <a href={homeDataset["route"]} class="text-center text-amber-900 hover:text-amber-600 focus:text-amber-600 focus:bg-neutral-200 focus:outline-none focus:shadow-outline hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:focus:text-amber-300 dark:hover:text-amber-300 dark:text-amber-600 rounded-md text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 py-1 flex items-center justify-center w-[120px] text-nowrap">
              Learn More
              <span class="pl-1" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </span>
            </a>
          </p>
        </dd>
      </div>
    {/if}
  {/each}
{/if}