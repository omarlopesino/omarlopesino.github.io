import Modal from "./Modal.astro";

export default {
  title: 'Components/Modal',
  component: Modal,
  args: {
    id: 'story-modal',
    label: 'Check my skills',
    closeLabel: 'Close',
    slots: {
      default: '<h3 class="text-title text-center">Skills</h3><p class="text-base text-center text-base-content/70">What I actually reach for, grouped by where it fits in a project.</p>',
    },
  },
};

export const Default = {};

// Wider than the default box, for content that needs the room — a table, a set of tabs.
export const Wide = {
  args: {
    id: 'story-modal-wide',
    boxClass: 'max-w-3xl',
  },
};

// No label: the modal ships without a trigger, opened by a <label for> elsewhere on the page.
export const WithoutTrigger = {
  args: {
    id: 'story-modal-untriggered',
    label: undefined,
  },
};
