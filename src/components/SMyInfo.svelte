<script>
  import { onMount } from "svelte";
  import { getUserInfo, logout } from "../libs/auth.svelte";
  import { redirectTo } from "../libs/redirect.svelte";
  import { getDirectusInstance } from "../libs/client.svelte";
  import { updateMe } from "@directus/sdk";

  let isAuthed;
  let userInfo;

  let first_name;
  let input_first_name;
  let last_name;
  let input_last_name;
  let id;
  let role;
  let email;

  let showNote = false;
  let updateFlag = false;

  onMount( async () => {
    ({isAuthed, userInfo} = await getUserInfo());
    if (isAuthed) {
      first_name = userInfo['first_name'] === null ? '' : userInfo['first_name'];
      last_name  = userInfo[ 'last_name'] === null ? '' : userInfo[ 'last_name'];
      id = userInfo['external_identifier'];
      role = userInfo['role'];
      email = userInfo['email'];
    } else {
      redirectTo('/signin')
    }
  });

  $: input_first_name = first_name;
  $: input_last_name = last_name;

  async function updateUserInfo() {
    showNote = true;
    updateFlag = false;
    const client = getDirectusInstance();
    let newUserInfo = {};
    if (input_first_name !== first_name) {
      newUserInfo['first_name'] = input_first_name;
    }

    if (input_last_name !== last_name) {
      newUserInfo['last_name'] = input_last_name;
    }

    let newUserInfoKeys = Object.keys(newUserInfo)
    if (newUserInfoKeys.length !== 0) {
      const result = await client.request(
        updateMe(
          newUserInfo,
          {fields: newUserInfoKeys}
        )
      );
      if (result) {
        updateFlag = true;
        first_name = result['first_name']
        last_name = result['last_name']
      }
    }
  }

  async function logoutAndRedirect(path) {
    await logout();
    redirectTo(path);
  }

</script>

<form class="flex w-full items-center justify-center space-y-6 columns-1" on:submit|preventDefault={updateUserInfo}>
  <div class="w-4/5 md:w-3/5 relative -space-y-px rounded-md grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
    <div>
      <label for="first-name" class="block mx-3 text-neutral-900 dark:text-neutral-300">First Name</label>
      <input
        id="first-name"
        name="First Name"
        type="text"
        autocomplete="off"
        class="relative block mt-2 px-4 w-full rounded-md py-1.5 text-neutral-900 dark:text-neutral-900 dark:bg-neutral-400 border border-neutral-600 placeholder:text-neutral-500 dark:border-amber-800 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 dark:focus:outline-none dark:focus:border-amber-800 dark:focus:ring-1 dark:focus:ring-amber-800 sm:text-sm sm:leading-6"
        placeholder="First Name"
        bind:value={input_first_name}
      />
    </div>
    <div>
      <label for="last-name" class="block mx-3 text-neutral-900 dark:text-neutral-300">Last Name</label>
      <input
        id="last-name"
        name="Last Name"
        type="text"
        autocomplete="off"
        class="relative block mt-2 px-4 w-full rounded-md py-1.5 text-neutral-900 dark:text-neutral-900 dark:bg-neutral-400 border border-neutral-600 placeholder:text-neutral-500 dark:border-amber-800 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 dark:focus:outline-none dark:focus:border-amber-800 dark:focus:ring-1 dark:focus:ring-amber-800 sm:text-sm sm:leading-6"
        placeholder="Last Name"
        bind:value={input_last_name}
      />
    </div>
    <div>
      <label for="id" class="block mx-3 text-neutral-900 dark:text-neutral-300">GitHub Identifier</label>
      <input
        id="id"
        name="GitHub Identifier"
        type="text"
        autocomplete="off"
        class="cursor-not-allowed mt-2 relative block px-4 w-full rounded-md py-1.5 text-neutral-900 bg-neutral-300 dark:text-neutral-100 dark:bg-neutral-600 border border-neutral-200 placeholder:text-neutral-500 dark:border-neutral-500 sm:text-sm sm:leading-6"
        placeholder={id}
        disabled
      />
    </div>
    <div>
      <label for="role" class="block mx-3 text-neutral-900 dark:text-neutral-300">Role</label>
      <input
        id="role"
        name="role"
        type="text"
        autocomplete="off"
        class="cursor-not-allowed relative mt-2 block px-4 w-full rounded-md py-1.5 text-neutral-900 bg-neutral-300 dark:text-neutral-100 dark:bg-neutral-600 border border-neutral-200 placeholder:text-neutral-500 dark:border-neutral-500 sm:text-sm sm:leading-6"
        placeholder={role}
        disabled
      />
    </div>
    <div>
      <label for="email" class="block mx-3 text-neutral-900 dark:text-neutral-300">E-Mail</label>
      <input
        id="email"
        name="E-Mail"
        type="email"
        autocomplete="off"
        class="cursor-not-allowed relative mt-2 block px-4 w-full rounded-md py-1.5 text-neutral-900 bg-neutral-300 dark:text-neutral-100 dark:bg-neutral-600 border border-neutral-200 placeholder:text-neutral-500 dark:border-neutral-500 sm:text-sm sm:leading-6"
        placeholder={email}
        disabled
      />
    </div>
    <div>
    </div>
    <div class="flex w-full justify-center text-nowrap text-ellipsis px-[1px] py-[1px]">
      <button type="submit" class="m-4 w-1/3 px-3 py-1 bg-neutral-500 text-neutral-100 dark:bg-neutral-300 dark:text-black dark:hover:bg-amber-600 dark:focus:bg-amber-800 hover:bg-neutral-600 focus:hover:bg-neutral-700 border-2 border-transparent rounded-md text-center transition focus-visible:ring-2 ring-offset-2 ring-neutral-200">Update</button>
    </div>
    <div class="flex w-full justify-center text-nowrap text-ellipsis px-[1px] py-[1px]">
      <button on:click={() => logoutAndRedirect('/signin')} class="m-4 w-1/3 px-3 py-1 border-2 border-purple-300 dark:text-white hover:bg-purple-500 text-black hover:text-white rounded-md text-center transition focus-visible:ring-1 ring-offset-1 ring-purple-200 focus:ring-purple-200">Log Out</button>
    </div>
    {#if showNote}
      <div class="flex w-full h-20 justify-center">
        {#if updateFlag}
          <span class="animate-pulse-single text-amber-800 dark:text-amber-600">Updated !</span>
        {:else}
          <span class="animate-pulse-single text-amber-800 dark:text-amber-600">No Change !</span>
        {/if}
      </div>
    {:else}
      <div class="flex w-full h-20 justify-center">
      </div>
    {/if}
  </div>
</form>