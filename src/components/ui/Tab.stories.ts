import Tab from "./Tab.astro";

export default {
  title: 'Components/Tab',
  component: Tab,
  args: {
    group: 'tab-story',
    label: 'Backend',
    checked: true,
    slots: {
      default: '<p class="p-4">The panel this tab opens.</p>',
    },
  },
};

export const Default = {};

export const NarrowPanel = {
  args: {
    label: 'Practice',
    panelClass: 'md:w-2/3 mx-auto pt-3',
  },
};
