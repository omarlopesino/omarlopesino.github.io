import Toc from "./Toc.astro";

export default {
  title: 'Components/Toc',
  component: Toc,
  args: {
    headings: [
      { depth: 2, slug: 'why-a-maintenance-window-is-the-wrong-default', text: 'Why a maintenance window is the wrong default' },
      { depth: 2, slug: 'splitting-the-work-into-idempotent-batches', text: 'Splitting the work into idempotent batches' },
      { depth: 3, slug: 'the-high-water-mark', text: 'The high-water mark' },
      { depth: 2, slug: 'what-broke-anyway', text: 'What broke anyway' },
    ],
  },
};

export const Default = {};

export const Open = {
  args: {
    open: true,
  },
};

// A post whose only headings are h1 or h4 and deeper renders nothing at all.
export const NoNavigableHeadings = {
  args: {
    headings: [
      { depth: 4, slug: 'an-aside', text: 'An aside' },
    ],
  },
};
