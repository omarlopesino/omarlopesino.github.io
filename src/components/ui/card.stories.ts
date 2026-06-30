import Card from "./Card.astro";

const image = '<img alt="Placeholder image" src="https://placehold.co/600x400/EEE/31343C" />'
const content = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>';
const actionClass = 'justify-end';

const defaultSlots = {
  content: content,
  image: image,
};

export default {
  title: 'Components/Card',
  component: Card,
  args:  {
    class: 'w-70',
    title: 'Card example',
    slots: defaultSlots,
  },
};

export const Default = {};

export const WithAction = {
  args: {
    actions: true,
    actionClass: actionClass,
    slots: {
      ...defaultSlots,
      cta: '<a class="btn btn-primary" href="#">Call to action</a>',
    },
  },
};

export const PostTeaser = {
  args: {
    class: 'w-70',
    tag: 'article',
    actionClass: actionClass,
    url: '#',
    slots: {
      content: '<div class="flex gap-3 py-2"><time datetime="2026-06-26" class="text-sm">2026-06-26</time> <div class="flex gap-3"><span class="badge badge-accent">Tag 1</span><span class="badge badge-accent">Tag 2</span></div></div>' + content,
      image: image,
    },
  },
};

export const Side = {
  args: {
    class: 'card-side',
    actions: true,
    actionClass: actionClass,
    slots: {
      ...defaultSlots,
    },
  },
};
