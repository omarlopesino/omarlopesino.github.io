import Breadcrumb from "./Breadcrumb.astro";

export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { label: 'Blog', href: '#' },
      { label: 'Backend', href: '#' },
      { label: 'Migrating 400k nodes without a maintenance window' },
    ],
  },
};

export const Default = {};

export const SingleLevel = {
  args: {
    items: [
      { label: 'Blog', href: '#' },
      { label: 'Tags' },
    ],
  },
};
