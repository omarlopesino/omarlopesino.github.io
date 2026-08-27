import BubbleList from "./BubbleList.astro";

export default {
  title: 'Components/BubbleList',
  component: BubbleList,
  args: {
    ariaLabel: 'Tags',
    items: [
      { label: '#drupal', href: '#' },
      { label: '#migrations', href: '#' },
      { label: '#php', href: '#' },
      { label: '#performance', href: '#' },
    ],
  },
};

export const Tags = {};

export const Years = {
  args: {
    ariaLabel: 'Years',
    items: [
      { label: '2026 (12)', href: '#' },
      { label: '2025 (31)', href: '#' },
      { label: '2024 (8)', href: '#' },
    ],
    bubbleClass: 'badge-secondary badge-lg font-medium no-underline',
  },
};
