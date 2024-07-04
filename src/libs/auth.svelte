<script context="module">
  import { readMe } from "@directus/sdk";

  import { getDirectusInstance } from "../libs/client.svelte";

  export async function getUserInfo() {
    const client = getDirectusInstance();
    try {
      const userInfo = await client.request(readMe({fields: ['external_identifier', 'email', 'role', 'first_name', 'last_name']}));

      if (userInfo) {
        return {
          isAuthed: true,
          userInfo: userInfo,
        };
      } else {
        return {
          isAuthed: false,
          userInfo: null,
        };
      }
    } catch (error) {
      return {
        isAuthed: false,
        userInfo: null,
      };
    }
  }

  export async function logout() {
    const client = getDirectusInstance();
    await client.logout();
  }

</script>