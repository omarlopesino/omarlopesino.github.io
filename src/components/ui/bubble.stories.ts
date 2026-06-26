import { a } from "storybook-static/_astro/axe-DhOe-1lm";
import Bubble from "./Bubble.astro";

const defaultSlots = {
  default: 'Test',
};

export default {
  title: 'Components/Bubble',
  component: Bubble,
  args: {
    class: 'badge-accent badge-xl',
    slots: defaultSlots,
  },
  argTypes: {
  },
};

export const Default = {};

export const Outline = {
  args: {
    class: 'badge-secondary badge-outline',
    slots: defaultSlots,
  }
};

export const Dash = {
  args: {
    class: 'badge-dash badge-xs',
    slots: defaultSlots,
  }
};
