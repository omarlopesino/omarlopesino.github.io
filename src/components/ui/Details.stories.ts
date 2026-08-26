import Details from "./Details.astro";
export default {
  title: 'Components/Details',
  component: Details,
  args:  {
    title: "Details title",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
};
export const Default = {};

export const SlottedTitle = {
  args: {
    slots: {
      title: '<div class="flex flex-col md:flex-row md:gap-6 md:w-full"><span class="font-semibold">Web application developer</span><span class="opacity-70">Metadrop</span><span class="text-sm md:ms-auto">2014 – Now</span></div>',
    },
  },
};

export const SlottedBody = {
  args: {
    slots: {
      default: '<p>Ten years building and running Drupal platforms.</p><ul class="list-disc ps-5 mt-2"><li>Custom Drupal modules.</li><li>Content migrations from several CMSs.</li></ul>',
    },
  },
};
