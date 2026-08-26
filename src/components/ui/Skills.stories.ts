import Skills from "./Skills.astro";

export default {
  title: 'Components/Skills',
  component: Skills,
  args: {
    groups: [
      {
        id: 'backend',
        label: 'Backend',
        items: [
          { name: 'PHP', description: 'The language under every platform I maintain — a decade of it, from inherited legacy to modern typed code.' },
          { name: 'Drupal', description: 'Custom modules, the entity and migration APIs, multisite architectures, and upgrades from Drupal 7 to 10.' },
          { name: 'REST APIs', description: 'Designing and operating the interfaces that connect a site to CRMs, payment providers and internal services.' },
        ],
      },
      {
        id: 'devops',
        label: 'DevOps',
        items: [
          { name: 'Docker', description: 'Docker and Docker Compose as the standard way every project I touch runs, locally and in CI.' },
          { name: 'Jenkins', description: 'Building and evolving the pipelines that test and deploy a site.' },
        ],
      },
      {
        id: 'practice',
        label: 'Practice',
        items: [
          { name: 'IT auditing', description: 'Reviewing an inherited platform and turning the findings into work a client can actually schedule.' },
        ],
      },
    ],
  },
};

export const Default = {};

export const SingleGroup = {
  args: {
    groups: [
      {
        id: 'practice',
        label: 'Practice',
        items: [
          { name: 'Technical documentation', description: 'Writing it, consulting it, and making it the thing a new developer reads instead of asking.' },
          { name: 'System performance', description: 'Finding what is slow under real load rather than what looks slow in development.' },
        ],
      },
    ],
  },
};

// Inside a narrow container — a modal box — the panel takes the whole width it is given.
export const FullWidthPanel = {
  args: {
    panelClass: 'pt-3',
  },
};
