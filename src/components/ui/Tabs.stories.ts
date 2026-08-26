import Tabs from "./Tabs.astro";

const tab = (group: string, label: string, body: string, checked = false) =>
  `<input type="radio" name="${group}" role="tab" class="tab" aria-label="${label}"${checked ? ' checked' : ''} />` +
  `<div role="tabpanel" class="tab-content"><p class="p-4">${body}</p></div>`;

export default {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    slots: {
      default: tab('demo', 'One', 'First panel.', true) + tab('demo', 'Two', 'Second panel.') + tab('demo', 'Three', 'Third panel.'),
    },
  },
};

export const Default = {};

// Its own radio group, so selecting here leaves the story above alone.
export const SecondGroup = {
  args: {
    slots: {
      default: tab('other', 'Alpha', 'Alpha panel.', true) + tab('other', 'Beta', 'Beta panel.'),
    },
  },
};
