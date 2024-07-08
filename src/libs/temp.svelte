<script>
  import { readSingleton } from "@directus/sdk";
  import { getDirectusInstance } from "../libs/client.svelte";
  import { onMount } from "svelte";
  import {marked} from 'marked';

  let content;

  onMount( async () => {
    const client = getDirectusInstance(false);
    content = await client.request(readSingleton('Younger_Introduction', {fields: ['md']}));
    content = marked.parse(content['md'],{
      breaks: true,
      sanitize: true,
      smartypants: true,
    });
  });
</script>

{@html content}