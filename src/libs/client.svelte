<script context="module">

  import { createDirectus, authentication, rest } from "@directus/sdk";

  export function getDirectusInstance() {
    const client = createDirectus('http://localhost:16861/')
      .with(authentication('session', { credentials: 'include' }))
      .with(rest({ credentials: 'include' }));
    return client;
  }

</script>