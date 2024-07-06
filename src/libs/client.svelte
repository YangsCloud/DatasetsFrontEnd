<script context="module">

  import { createDirectus, authentication, rest } from "@directus/sdk";

  export function getDirectusInstance(auth=true) {
    if (auth) {
      const client = createDirectus('http://localhost:16861/')
        .with(authentication('session', { credentials: 'include' }))
        .with(rest({ credentials: 'include' }));
      return client;
    } else {
      const client = createDirectus('http://localhost:16861/')
        .with(rest());
      return client;
    }
  }

</script>