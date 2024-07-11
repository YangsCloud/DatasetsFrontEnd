<script context="module">

  import { DIRECTUS_API_URL } from "../constants";

  import { createDirectus, authentication, rest } from "@directus/sdk";

  export function getDirectusInstance(auth=true) {
    if (auth) {
      const client = createDirectus(DIRECTUS_API_URL)
        .with(authentication('session', { credentials: 'include' }))
        .with(rest({ credentials: 'include' }));
      return client;
    } else {
      const client = createDirectus(DIRECTUS_API_URL)
        .with(rest());
      return client;
    }
  }

</script>