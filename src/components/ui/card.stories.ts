import Card from "./Card.astro";

const image = '<img alt="Placeholder image" src="https://placehold.co/600x400/EEE/31343C" />'
const cta = 
  '<a class="btn btn-primary" href="#">Call to action</btn>';


export default {
  title: 'Components/Card',
  component: Card,
  args:  {
    title: 'Card example',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    slots: {
      image: image,
      cta: cta,
    },
  },
};

export const Default = {};
