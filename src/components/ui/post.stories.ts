import Post from "./Post.astro";

const content = `
  <h2>Introduction to Modern Web Technologies</h2>
  <p>Web development is evolving at a frantic pace. Today, we don't just care about clean semantics, but also about performance, optimization, and user experience (UX).</p>
  
  <h3>Why structured content matters</h3>
  <p>When writing a blog post, maintaining a solid HTML hierarchy is crucial for two main reasons:</p>
  <ul>
    <li><strong>SEO (Search Engine Optimization):</strong> Search engines can index and understand your content much better.</li>
    <li><strong>Accessibility:</strong> Screen readers can seamlessly guide users with visual impairments through your layout.</li>
  </ul>

  <blockquote>"Simplicity is the soul of efficiency." – Austin Freeman</blockquote>

  <h3>Adding code snippets to your posts</h3>
  <p>If your blog covers tech or development, you will eventually need to display code snippets like this one:</p>
  <pre><code>const greet = () => console.log("Hello, world!");</code></pre>

  <p>In summary, always make sure your global or component scoped CSS properly handles the margins, line-heights, and font sizes of all these standard HTML tags within the post body.</p>
`;

export default {
  title: 'Components/Post',
  component: Post,
  args:  {
    title: 'My awesome post',
    category: {
      name: 'Test',
      id: 'test',
      slug: 'test',
      language: 'es',
    },
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    tags: [
      { name: 'Tag 1', slug: 'blog/tags/tag-1' },
      { name: 'Tag 2', slug: 'blog/tags/tag-2' },
    ],
    pubDate: new Date('2026-06-26'),
    image: {
        src: '/960x540.jpg',
        alt: 'My awesome image',
        width: 960,
        height: 520,
    },
    url: '#',
    slots: {
      content: content,
    },
  },
};
export const Default = {};
