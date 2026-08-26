import DefinitionTable from "./DefinitionTable.astro";

export default {
  title: 'Components/DefinitionTable',
  component: DefinitionTable,
  args: {
    items: [
      { name: 'Creating websites', description: 'Drupal or Symfony on the back end, with the front end built in Twig, Vue, Angular, Drupal SDC, Tailwind or DaisyUI.' },
      { name: 'REST APIs', description: 'Interfaces other systems can actually consume: mobile apps, single-page front ends and a partner’s software.' },
      { name: 'Integrations', description: 'Signing people in through the identity provider you already run — Microsoft Entra ID, Keycloak.' },
    ],
  },
};

export const Default = {};

// The skills panels pass the badge classes so the term reads as a chip instead of bold text.
export const ChipTerms = {
  args: {
    termClass: 'badge badge-accent badge-sm',
  },
};
