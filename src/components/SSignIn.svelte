<script>
  import { onMount } from "svelte";
  import { getUserInfo, logout } from "../libs/auth.svelte"
  import { redirectTo } from "../libs/redirect.svelte";

  let isAuthed;
  let userInfo;
  let userName;
  let userMail;
  onMount( async () => {
    ({isAuthed, userInfo} = await getUserInfo());
    if (isAuthed) {
      let fname = userInfo["first_name"] === null ? "" : userInfo["first_name"];
      let lname = userInfo["last_name" ] === null ? "" : userInfo["last_name" ];
      let uname = fname + " " + lname;
      if (uname.trim() === "") {
          userName = userInfo["external_identifier"];
      } else {
          userName = uname;
      }
      userMail = userInfo["email"];
    }
  });

  async function logoutAndRedirect(path) {
    await logout();
    redirectTo(path);
  }
</script>

<div>
  {#if isAuthed}
    <h2 class="text-center text-2xl md:text-xl font-bold leading-2 tracking-tight text-neutral-900 dark:text-amber-600">Welcome! <br/> {userName}</h2>
    <p class="font-semibold text-center text-sm leading-6 text-amber-600 dark:text-neutral-300">
    The Authorized GitHub Account is: <span class="font-bold text-amber-800 dark:text-neutral-200">{userMail}</span>
    </p>
  {:else}
    <h2 class="text-center text-2xl md:text-xl font-bold leading-2 tracking-tight text-neutral-900 dark:text-amber-600">Sign In With GitHub</h2>
    <p class="font-bold text-center text-sm leading-6 text-amber-600 dark:text-neutral-300">
    We Only Support GitHub OAuth2.0
    </p>
  {/if}
</div>
<div class="p-2 flex flex-row items-center justify-center">
  {#if isAuthed}
    <slot name="myinfo_button"/>
  {:else}
    <slot name="signin_button"/>
  {/if}
</div>
<p class="font-bold text-center text-sm leading-6 text-gray-500">
  {#if isAuthed}
    Do You Want To Log Out?
  {:else}
    Do Not Have Account of GitHub?
  {/if}
</p>
<div class="p-2 flex flex-row items-center justify-center">
  {#if isAuthed}
    <button on:click={() => logoutAndRedirect('/signin')} class="w-1/8 px-2 py-1 text-xs border-2 border-purple-300 dark:text-purple-300 hover:bg-purple-500 text-purple-600 hover:text-purple-200 rounded-md text-center transition focus-visible:ring-1 ring-offset-1 ring-purple-200 focus:ring-purple-200">Log Out</button>
  {:else}
    <slot name="signup_button"/>
  {/if}
</div>