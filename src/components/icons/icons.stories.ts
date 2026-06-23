import LinkedIn from './LinkedIn.astro';

export default {
  title: 'Components/Icons',
  component: LinkedIn,
  args: { class: 'w-8 h-8' },
  argTypes: {
    class: {
      control: 'select',
      options: ['w-4 h-4', 'w-6 h-6', 'w-8 h-8', 'w-12 h-12', 'w-16 h-16'],
    },
  },
};

export const LinkedInIcon = {};
