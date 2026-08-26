import IconCardLink from "./IconCardLink.astro";

export default {
  title: 'Components/IconCardLink',
  component: IconCardLink,
  args: {
    icon: 'mdi:briefcase-outline',
    label: 'View my work',
    href: '#work',
  },
};

export const Default = {};

export const Studies = {
  args: {
    icon: 'mdi:school-outline',
    label: 'Look at my foundations',
    href: '#studies',
  },
};

export const Skills = {
  args: {
    icon: 'mdi:tools',
    label: 'Check my skills',
    href: '#skills',
  },
};
