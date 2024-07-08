<script>
  import { onMount } from "svelte";
  import { readSingleton } from "@directus/sdk";
  import { parseMarkdown } from "../../libs/markdown.svelte";
  import { getDirectusInstance } from "../../libs/client.svelte";
  import SMarkdownBody from "../SMarkdownBody.svelte";
  import SMarkdownHead from "../SMarkdownHead.svelte";

  let content;
  let title;
  let author;
  let datetime;
  onMount( async () => {
    const client = getDirectusInstance(false);
    const markdown = await client.request(readSingleton('Younger_Introduction', {fields: ['md', 'title', 'author', 'date_updated']}));
    console.log(markdown['md'])
    content = parseMarkdown(markdown['md']);
    title = markdown['title'];
    author = markdown['author'];
    datetime = markdown['date_updated'];
    datetime = new Date(datetime);
    datetime = datetime.toLocaleString();
  });

</script>

<SMarkdownHead title={title} create_author={author} update_author={author} create_datetime={datetime} update_datetime={datetime}/>
<SMarkdownBody body={content} />