import Post from "./Post.astro";

const content = `
  <h2 id="why-a-maintenance-window-is-the-wrong-default">Why a maintenance window is the wrong default</h2>
  <p>A window is a promise that the site is allowed to be wrong for a while. On a site with editors in three timezones that promise costs more than the migration does, and it hides the real problem: a migration that cannot be interrupted is a migration you cannot debug.</p>

  <h2 id="splitting-the-work-into-idempotent-batches">Splitting the work into idempotent batches</h2>
  <p>The map is the whole trick. Batch on the source's own ordering, never on an offset, and record the high-water mark in <code>migrate_map_*</code> as you go.</p>
  <ul>
    <li><strong>Key on the legacy id</strong>, never on the title.</li>
    <li>Roll back a batch, not the migration.</li>
    <li>Log the rows you skip — they are the interesting ones.</li>
  </ul>

  <h3 id="the-high-water-mark">The high-water mark</h3>
  <blockquote>A migration that cannot be run twice is a script, not a migration.</blockquote>
  <pre><code>$ drush migrate:import legacy_node --limit=2000</code></pre>

  <h2 id="what-broke-anyway">What broke anyway</h2>
  <p>Two things, both in the source: a nullable column that was not, and a redirect table nobody had opened since 2014.</p>
`;

const category = {
  name: 'Backend',
  cid: 'backend',
  slug: 'backend',
  language: 'en',
};

const image = {
  src: '/960x540.jpg',
  alt: 'My awesome image',
  width: 960,
  height: 540,
};

export default {
  title: 'Components/Post',
  component: Post,
  args: {
    title: 'Migrating 400k nodes without a maintenance window',
    category,
    description: 'The migrate API will happily run against a live site once you stop treating a migration as one long transaction. Here is the rollout that moved a decade of legacy content across, one idempotent batch at a time.',
    tags: [
      { name: 'Drupal', slug: 'drupal', cid: 'drupal', language: 'en' },
      { name: 'Migrations', slug: 'migrations', cid: 'migrations', language: 'en' },
      { name: 'PHP', slug: 'php', cid: 'php', language: 'en' },
    ],
    pubDate: new Date('2026-06-30'),
    image,
    url: '#',
    readingTime: 8,
    headings: [
      { depth: 2, slug: 'why-a-maintenance-window-is-the-wrong-default', text: 'Why a maintenance window is the wrong default' },
      { depth: 2, slug: 'splitting-the-work-into-idempotent-batches', text: 'Splitting the work into idempotent batches' },
      { depth: 3, slug: 'the-high-water-mark', text: 'The high-water mark' },
      { depth: 2, slug: 'what-broke-anyway', text: 'What broke anyway' },
    ],
    recommended: [
      { title: 'Config split without the config drift', description: 'Two environments, one config directory, and the split that keeps them apart.', url: '#', pubDate: new Date('2026-06-12'), image, category },
      { title: 'Entity queries that survive a schema change', description: 'Query the entity API, not the tables underneath it.', url: '#', pubDate: new Date('2026-05-28'), image, category },
    ],
    slots: {
      content,
    },
  },
};

export const Default = {};

// A short post with no headings and nothing to recommend: no contents block, no closing strip.
export const Minimal = {
  args: {
    headings: [],
    recommended: [],
    readingTime: 1,
    tags: [
      { name: 'Drupal', slug: 'drupal', cid: 'drupal', language: 'en' },
    ],
    slots: {
      content: '<p>One paragraph, and then it is over.</p>',
    },
  },
};
