<script context='module'>
  import { marked } from 'marked';

  export function parseMarkdown(markdown) {
    return marked.parse(
      markdown,
      {
        breaks: true,
        sanitize: true,
        smartypants: true,
      }
    );
  }

</script>