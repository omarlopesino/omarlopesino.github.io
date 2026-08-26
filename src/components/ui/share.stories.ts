import Share from "./Share.astro";

export default {
  title: 'Components/Share',
  component: Share,
  args:  {
    id: 'share',
    url: 'https://example.com',
    title: 'Example',
    text: 'Text Example',
  },
};

export const Default = {};

export const WithLabel = {
  args: {
    id: 'share_labelled',
    label: 'Share',
  },
};
