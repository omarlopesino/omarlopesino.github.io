import { Icon } from 'astro-icon/components';

export default {
  title: 'Components/Icons',
  component: Icon,
  args: {
    name: 'simple-icons:linkedin',
    class: 'text-base-content w-8 h-8',
  },
  argTypes: {
    name: {
      control: 'select',
      options: [
        'simple-icons:linkedin',
        'simple-icons:github',
        'mdi:email-outline',
        'mdi:rss',
      ],
    },
    class: { control: 'text' },
  },
};

export const Default = {};
