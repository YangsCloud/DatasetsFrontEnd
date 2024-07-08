<script>
  import { onMount } from "svelte";
  import { readSingleton } from "@directus/sdk";
  import { parseMarkdown } from "../libs/markdown.svelte";
  import { getDirectusInstance } from "../libs/client.svelte";
  import SMarkdownBody from "./SMarkdownBody.svelte";
  import SMarkdownHead from "./SMarkdownHead.svelte";

  export let singletonName;
  let title;
  let author;
  let created_datetime;
  let updated_datetime;
  let content;
  onMount( async () => {
    const client = getDirectusInstance(false);
    const singleton = await client.request(readSingleton(singletonName, {fields: ['title', 'author', 'date_created', 'date_updated', 'content']}));
    console.log(singleton)
    title = singleton['title'];
    author = singleton['author'];
    created_datetime = (new Date(singleton['date_created'])).toLocaleString();
    updated_datetime = (new Date(singleton['date_updated'])).toLocaleString();
    content = parseMarkdown(singleton['content']);
  });

</script>

<SMarkdownHead title={title} author={author} created_datetime={created_datetime} updated_datetime={updated_datetime}/>
<SMarkdownBody body={content} />