import Logo from "./Logo.astro";

export default {
  title: 'Components/Logo',
  component: Logo,
  args: {},
};

export const Default = {};

// The about-me page has no title of its own, so the site name carries the h1 there.
export const AsHeading = {
  args: {
    tag: 'h1',
  },
};
