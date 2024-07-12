<script>
  import { DIRECTUS_API_URL } from "../../constants";

  import { onMount } from "svelte";
  import { readItems } from "@directus/sdk";
  import { redirectTo } from "../../libs/redirect.svelte";
  import { getUserInfo } from "../../libs/auth.svelte";
  import { getDirectusInstance } from "../../libs/client.svelte";

  let isAuthed;
  let userInfo;

  let total_item = 0;
  let total_page = 0;
  let page_index = 0;
  let show_count = 50;
  let show_count_options = [50, 100, 200];

  let search_key = '';
  let selected_v = 'all'; // 'all' 'paper' 'publish'
  let with_attrs = false;
  let n_sort_idx = 0; // 0: no-sort; 1: sort-asc; 2: sort-dsc;
  let e_sort_idx = 0; // 0: no-sort; 1: sort-asc; 2: sort-dsc;

  let check_page = false;
  let check_list = [];

  let instances = [];

  async function getPage(reload=false) {
    const client = getDirectusInstance();

    let options = {};

    options['filter'] = {};
    options['filter']['with_attributes'] = { _eq: with_attrs };

    if ( search_key || selected_v !== 'all') {
      if ( search_key ) {
        options['filter']['model_name'] = { _contains: search_key };
      }

      if ( selected_v !== 'all' ) {
        if ( selected_v === 'paper_w' ) {
          options['filter']['since_version'] = { _eq: 'paper' };
        } else {
          options['filter']['since_version'] = { _neq: 'paper' };
        }
      }
    }

    if (reload) {
      total_item = (await client.request(
        readItems(
          'YoungerSeriesFilter',
          {
            aggregate: { count: '*' },
            ...options,
          },
        )
      ))[0]['count'];
      total_page = Math.ceil(total_item / show_count);
      page_index = Math.min(total_page, 1);
    } else {
      page_index = total_page ? Math.min(Math.max(1, page_index), total_page) : 0;
    }

    if (page_index) {
      instances = await client.request(
        readItems(
          'YoungerSeriesFilter',
          {
            fields: ['id', 'instance_hash', 'node_number', 'edge_number', 'since_version', 'status', 'date_created', 'instance_meta', 'instance_tgz'],
            limit: show_count,
            page: page_index,
            ...options,
          }
        )
      )
      for (let check_index=0; check_index < instances.length; check_index++) {
        check_list[check_index] = false;
      }
    } else {
      instances = [];
      check_list = [];
    }
  }

  onMount( async () => {
    ({isAuthed, userInfo} = await getUserInfo());
    if (isAuthed) {
      await getPage(true);
    }
  });

</script>

<section class="container px-6 py-3 mx-auto">
  <div class="mx-2 sm:flex sm:items-center sm:justify-between">
    <div>
      <div class="flex items-center gap-x-3">
        <h2 class="text-lg font-medium text-amber-800 dark:text-amber-600">Younger - Filter Series</h2>
        <span class="px-3 py-1 text-xs text-purple-600 bg-purple-100 rounded-full dark:bg-neutral-600 dark:text-purple-300">{total_item} Instances</span>
      </div>
      <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-300">All Instances Derived From Public Real-World Model Hubs.</p>
    </div>

    <div class="flex items-center justify-center mt-6 gap-x-1 grid grid-cols-1 md:grid-cols-2">
      <div class="flex items-center justify-center">
        <button disabled class="cursor-not-allowed flex items-center justify-center w-6/8 sm:w-5/6 px-2 py-2 mx-2 my-2 text-sm text-nowrap tracking-wide text-neutral-100 transition-colors duration-200 bg-purple-500 border rounded-lg gap-x-2 hover:bg-purple-600 dark:hover:bg-purple-500 dark:bg-purple-600 dark:border-purple-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
          </svg>
          <span>Upload New</span>
        </button>
      </div>
      <div class="flex items-center justify-center">
        <button disabled class="cursor-not-allowed flex items-center justify-center gap-x-2 w-7/8 sm:w-9/10 px-2 py-2 mx-2 my-1 md:my-0 text-sm text-nowrap tracking-wide text-neutral-800 transition-colors duration-200 bg-neutral-100 border rounded-lg dark:hover:bg-amber-800 dark:bg-amber-900 hover:bg-neutral-50 dark:text-neutral-200 dark:border-amber-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
          </svg>
          <span>Download Selected</span>
        </button>
      </div>
    </div>
  </div>

  <div class="mx-2 mt-2 lg:flex lg:items-center lg:justify-between grid grid-cols-1 lg:grid-cols-3">
    <div class="relative flex items-center">
      <span class="absolute">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mx-3 text-neutral-600 dark:text-neutral-300">
          <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </span>
      <input type="text" placeholder="Search Model Name" class="block w-full py-1.5 pr-6 text-neutral-800 bg-neutral-200 border border-neutral-300 rounded-lg lg:w-80 placeholder-neutral-500 pl-11 dark:bg-neutral-700 dark:text-neutral-300 dark:border-amber-800 focus:border-amber-600 dark:focus:border-amber-600 focus:ring-amber-600 focus:outline-none focus:ring focus:ring-opacity-50" bind:value={search_key} on:keydown={async (event) => {if (event.key === 'Enter') { await getPage(true) }}}>
    </div>

    <div class="flex justify-center mt-2 lg:mt-0">
      <div class="inline-flex overflow-hidden bg-neutral-300 dark:bg-neutral-800 border divide-x rounded-lg border-neutral-300 dark:bg-neutral-700 dark:border-neutral-500 dark:divide-neutral-500">
        <label for="with-attributes" class="inline-flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-1.5 dark:border-neutral-700 dark:bg-neutral-800">
          <input bind:value={with_attrs} on:change={async () => { with_attrs = !with_attrs; await getPage(true);}} id="with-attributes" type="checkbox" class="peer sr-only" role="switch" checked />
          <span class="trancking-wide text-xs font-medium text-neutral-500 peer-checked:text-neutral-600 dark:text-neutral-500 dark:peer-checked:text-neutral-300">With Attributes</span>
          <div class="relative bg-neutral-300 dark:bg-neutral-800 h-5 w-9 after:h-3 after:w-3 peer-checked:after:translate-x-4 rounded-full border border-neutral-300 bg-neutral after:absolute after:bottom-0 after:left-[0.1625rem] after:top-0 after:my-auto after:rounded-full after:bg-neutral-700 after:transition-all after:content-[''] peer-checked:bg-purple-700 peer-checked:after:bg-neutral-100 peer-focus:outline peer-focus:outline-2 peer-focus:outline-offset-2 peer-focus:outline-neutral-800 peer-focus:peer-checked:outline-purple-700 peer-active:outline-offset-0 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:border-neutral-700 dark:bg-neutral-900 dark:after:bg-neutral-300 dark:peer-checked:bg-purple-600 dark:peer-checked:after:bg-neutral-100 dark:peer-focus:outline-neutral-300 dark:peer-focus:peer-checked:outline-purple-600" aria-hidden="true"></div>
        </label>
      </div>
    </div>

    <div class="flex justify-center mt-2 lg:mt-0">
      <div class="inline-flex overflow-hidden bg-neutral-300 border divide-x rounded-lg border-neutral-300 dark:bg-neutral-700 dark:border-neutral-500 dark:divide-neutral-500">
        {#if selected_v === 'all'}
          <button on:click={async () => { selected_v = 'all'; await getPage(true);}} class="px-2 py-2 text-xs font-medium transition-colors duration-200 sm:text-sm dark:bg-neutral-800 dark:text-neutral-300 bg-neutral-100 text-neutral-600">
            View All
          </button>
        {:else}
          <button on:click={async () => { selected_v = 'all'; await getPage(true);}} class="px-2 py-2 text-xs font-medium text-neutral-500 transition-colors duration-200 sm:text-sm dark:hover:bg-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600">
            View All
          </button>
        {/if}

        {#if selected_v === 'paper'}
          <button on:click={async () => { selected_v = 'paper'; await getPage(true);}} class="px-2 py-2 text-xs font-medium transition-colors duration-200 sm:text-sm dark:bg-neutral-800 dark:text-neutral-300 bg-neutral-100 text-neutral-600">
            Paper Version
          </button>
        {:else}
          <button on:click={async () => { selected_v = 'paper'; await getPage(true);}} class="px-2 py-2 text-xs font-medium text-neutral-500 transition-colors duration-200 sm:text-sm dark:hover:bg-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600">
            Paper Version
          </button>
        {/if}

        {#if selected_v === 'publish'}
          <button on:click={async () => { selected_v = 'publish'; await getPage(true);}} class="px-2 py-2 text-xs font-medium transition-colors duration-200 sm:text-sm dark:bg-neutral-800 dark:text-neutral-300 bg-neutral-100 text-neutral-600">
            Publish Version
          </button>
        {:else}
          <button on:click={async () => { selected_v = 'publish'; await getPage(true);}} class="px-2 py-2 text-xs font-medium text-neutral-500 transition-colors duration-200 sm:text-sm dark:hover:bg-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600">
            Publish Version
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Table Body -->
  {#if isAuthed && instances.length}
    <div class="flex flex-col mt-2">
      <div class="-mx-3 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden border border-neutral-300 dark:border-neutral-600 md:rounded-lg">
            <table class="min-w-full divide-y divide-neutral-300 dark:divide-neutral-700">
              <thead class="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th scope="col" class="py-3.5 px-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                    <div class="flex items-center gap-x-2">
                      <input type="checkbox" bind:checked={check_page} on:change={() => { for (let check_i = 0; check_i < instances.length; check_i++) { check_list[check_i] = check_page; } }} class="w-3.5 h-3.5 text-amber-600 bg-amber-100 dark:bg-amber-600 border-neutral-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-neutral-800 focus:ring-2 dark:border-neutral-600">
                      Index
                      <!-- <button class="flex items-center gap-x-1 px-2">
                        <span>Index</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                        </svg>
                      </button> -->
                    </div>
                  </th>

                  <th scope="col" class="py-3.5 px-3 text-sm font-semibold text-center text-neutral-600 dark:text-neutral-300">
                    Instance Hash
                  </th>

                  <th scope="col" class="py-3.5 px-3 text-sm font-semibold text-center text-neutral-600 dark:text-neutral-300">
                    # Node
                    <!-- <button class="flex items-center gap-x-1 px-2">
                      <span># Node</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                      </svg>
                    </button> -->
                  </th>

                  <th scope="col" class="py-3.5 px-3 text-sm font-semibold text-center text-neutral-600 dark:text-neutral-300">
                    # Edge
                    <!-- <button class="flex items-center gap-x-1 px-2">
                      <span># Edge</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                      </svg>
                    </button> -->
                  </th>

                  <th scope="col" class="py-3.5 px-3 text-sm font-semibold text-center text-neutral-600 dark:text-neutral-300">
                    Date
                  </th>

                  <th scope="col" class="py-3.5 px-3 text-sm font-semibold text-center text-neutral-600 dark:text-neutral-300">
                    Version
                  </th>

                  <th scope="col" class="py-3.5 px-3 text-sm font-semibold text-center text-neutral-600 dark:text-neutral-300">
                    Status
                  </th>

                  <th scope="col" class="py-3.5 px-3 text-sm font-semibold text-center text-neutral-600 dark:text-neutral-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-300 dark:divide-neutral-700">
                {#each instances as instance, index}
                  <tr class="bg-neutral-100 even:bg-neutral-50 dark:bg-neutral-900 dark:even:bg-neutral-800">
                    <td class="px-3.5 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                      <div class="inline-flex items-center gap-x-3">
                        <input type="checkbox" bind:checked={check_list[index]} on:change={() => { check_page = check_list.every(check_item => check_item === true ) }} class="w-3.5 h-3.5 text-amber-600 bg-amber-100 dark:bg-amber-600 border-neutral-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-neutral-800 focus:ring-2 dark:border-neutral-600">
                        <span>#{index + 1}</span>
                      </div>
                    </td>
                    <td class="px-3 py-3 text-sm text-neutral-500 text-center dark:text-neutral-300 whitespace-nowrap">{instance['instance_hash']}</td>
                    <td class="px-3 py-3 text-sm text-neutral-500 text-center dark:text-neutral-300 whitespace-nowrap">{instance['node_number']}</td>
                    <td class="px-3 py-3 text-sm text-neutral-500 text-center dark:text-neutral-300 whitespace-nowrap">{instance['edge_number']}</td>
                    <td class="px-3 py-3 text-sm text-neutral-500 text-center dark:text-neutral-300 whitespace-nowrap">{(new Date(instance['date_created'])).toLocaleDateString()}</td>
                    <td class="px-3 py-3 text-sm text-neutral-500 text-center dark:text-neutral-300 whitespace-nowrap capitalize">{instance['since_version']}</td>
                    <td class="px-3 py-3 text-sm font-medium text-center text-neutral-700 whitespace-nowrap">
                      {#if instance['status'] === 'access'}
                        <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-1 text-green-600 bg-green-200 dark:bg-emerald-200">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                          <h2 class="text-sm font-normal">Access</h2>
                        </div>
                      {:else if instance['status'] === 'denied'}
                        <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-1 text-red-600 bg-red-200 dark:bg-rose-200">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                          <h2 class="text-sm font-normal">Denied</h2>
                        </div>
                      {:else if instance['status'] === 'recalled'}
                        <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-1 text-blue-600 bg-blue-200 dark:bg-sky-200">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                          </svg>
                          <h2 class="text-sm font-normal">Recalled</h2>
                        </div>
                      {:else}
                        <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-1 text-purple-600 bg-purple-200 dark:bg-fuchsia-200">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          <h2 class="text-sm font-normal">Unknown</h2>
                        </div>
                      {/if}
                    </td>
                    <td class="px-2 py-3 text-sm whitespace-nowrap">
                      <div class="flex items-center justify-center gap-x-3">
                        <button on:click={() => { window.open("/younger/dataset_series/filter/" + instance['id']); }} class="px-2 py-1 rounded-md dark:border-purple-800 dark:text-neutral-100 hover:bg-purple-300 dark:hover:bg-purple-700 text-purple-700 dark:text-purple-300 transition-colors duration-200">
                          Details
                        </button>
                        <button class="px-2 py-1 border rounded-md border-neutral-300 dark:border-amber-800 bg-neutral-200 dark:bg-amber-800 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-amber-700 text-neutral-700 transition-colors duration-200">
                          <a href={DIRECTUS_API_URL + "/assets/" + instance['instance_tgz'] + "?download"} target="_blank">Download</a>
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="flex items-center mt-6 text-center border rounded-lg h-96 dark:border-neutral-700">
      <div class="flex flex-col w-full max-w-sm px-3 mx-auto">
        <div class="p-3 mx-auto text-purple-500 bg-purple-100 rounded-full dark:bg-fuchsia-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <h1 class="mt-3 text-lg text-neutral-800 dark:text-neutral-100">No Instances Found</h1>
        {#if isAuthed}
          {#if search_key}
            <p class="mt-2 text-neutral-500 dark:text-neutral-500">Your search "{search_key}" did not match any Instances. Please try Again.</p>
            <div class="flex items-center mt-3 sm:mx-auto gap-x-3">
              <button on:click={() => { search_key = ''; getPage(true); }} class="w-1/2 px-5 py-2 text-sm text-neutral-700 transition-colors duration-200 bg-neutral-300 border border-neutral-500 rounded-lg sm:w-auto dark:hover:bg-neutral-600 dark:bg-neutral-900 hover:bg-neutral-100 dark:text-neutral-200 dark:border-neutral-700">
                <span>Clear Search Key</span>
              </button>
            </div>
          {:else}
            <p class="mt-2 text-neutral-500 dark:text-neutral-500">The version "{selected_v.charAt(0).toUpperCase() + selected_v.slice(1)}" does not contains any Instances. Please try Again.</p>
            <div class="flex items-center mt-3 sm:mx-auto gap-x-3">
              <button on:click={() => { selected_v = 'all'; getPage(true); }} class="w-1/2 px-5 py-2 text-sm text-neutral-700 transition-colors duration-200 bg-neutral-300 border border-neutral-500 rounded-lg sm:w-auto dark:hover:bg-neutral-600 dark:bg-neutral-900 hover:bg-neutral-100 dark:text-neutral-200 dark:border-neutral-700">
                <span>Clear Version Selection</span>
              </button>
            </div>
          {/if}
        {:else}
          <p class="mt-2 text-neutral-500 dark:text-neutral-500">Looking For Instances of Filter Series Require GitHub OAuth. Please Sign In.</p>
          <div class="flex items-center mt-3 sm:mx-auto gap-x-3">
            <button on:click={() => { redirectTo("/signin") }} class="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-neutral-100 transition-colors duration-200 bg-purple-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-purple-600 dark:hover:bg-purple-500 dark:bg-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
              </svg>
              <span>Sign In</span>
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- ! Table Body ! -->

  <div class="mx-2 mt-6 sm:flex sm:items-center sm:justify-between">
    <div class="flex items-center justify-center text-sm font-medium text-neutral-700 dark:text-neutral-300 gap-x-2">
      <div class="relative flex w-full max-w-xs justify-center items-center gap-1 text-slate-700 dark:text-slate-300">
        <span class="font-normal text-neutral-500 dark:text-neutral-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z" />
          </svg>
        </span>
        <label for="show-count" class="font-normal text-neutral-500 dark:text-neutral-500">Show</label>
        <select id="show-count" name="show-count" class="w-[76px] p-0 pl-3 h-6 rounded-md border border-neutral-300 bg-neutral-200 text-sm text-neutral-500 focus:ring-1 focus:ring-purple-300 focus:border-2 focus:border-purple-600 dark:border-purple-800 dark:bg-neutral-700 dark:focus:ring-1 dark:focus:ring-purple-500 dark:focus:border-2 dark:focus:border-purple-800" bind:value={show_count} on:change={() => { page_index = 1; getPage(); }}>
          {#each show_count_options as show_count_option}
            <option value={show_count_option}>{show_count_option}</option>
          {/each}
        </select>
        <span class="font-normal text-neutral-500 dark:text-neutral-500 text-nowrap">Items/Page</span>
      </div>
    </div>
    <div class="flex items-center justify-center text-sm font-medium text-neutral-700 dark:text-neutral-300 gap-x-2 mt-3 sm:mt-0">
      <span class="font-normal text-neutral-500 dark:text-neutral-500">Page</span>
      <input id="page" type="text" placeholder="1" class="h-6 -indent-px text-center text-sm block indent-0 aligh-middle w-16 px-2 py-1 text-neutral-800 bg-neutral-200 border border-neutral-300 rounded-md placeholder-neutral-500 dark:bg-neutral-700 dark:text-neutral-300 dark:border-amber-800 focus:border-amber-600 dark:focus:border-amber-600 focus:ring-amber-600 focus:outline-none focus:ring focus:ring-opacity-50" bind:value={page_index} on:keydown={(event) => { if (event.key === 'Enter') { getPage(); } }}>
      <span class="text-nowrap">of {total_page}</span>
    </div>
    <div class="flex items-center mt-3 gap-x-2 sm:mt-0">
      <a href="#top" on:click={() => { page_index = Math.max(Math.min(total_page, 1), page_index - 1); getPage(); }} class="flex items-center justify-center w-1/2 px-2 py-2 text-sm text-neutral-700 capitalize transition-colors duration-200 bg-neutral-200 border border-neutral-300 shadow-md shadow-neutral-500 dark:shadow-amber-900 rounded-md sm:w-auto gap-x-2 hover:bg-neutral-100 dark:bg-amber-900 dark:text-neutral-200 dark:border-amber-700 dark:hover:bg-amber-800">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
        </svg>
        <span>
          previous
        </span>
      </a>

      <a href="#top" on:click={() => { page_index = Math.min(total_page, page_index + 1); getPage(); }} class="flex items-center justify-center w-1/2 px-2 py-2 text-sm text-neutral-700 capitalize transition-colors duration-200 bg-neutral-200 border border-neutral-300 shadow-md shadow-neutral-500 dark:shadow-amber-900 rounded-md sm:w-auto gap-x-2 hover:bg-neutral-100 dark:bg-amber-900 dark:text-neutral-200 dark:border-amber-700 dark:hover:bg-amber-800">
        <span>
          Next
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </svg>
      </a>
    </div>
  </div>
</section>