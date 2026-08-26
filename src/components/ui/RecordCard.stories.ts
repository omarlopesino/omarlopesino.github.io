import RecordCard from "./RecordCard.astro";

export default {
  title: 'Components/RecordCard',
  component: RecordCard,
  args: {
    title: 'Web application developer',
    organization: 'Metadrop',
    startDate: '2014',
    endDate: 'Now',
    summary: 'Ten years building and running Drupal platforms for NGOs, public administrations and news media.',
    highlights: [
      'Mentoring and technical leadership in teams of up to ten people.',
      'Server-side backend development and custom Drupal modules.',
      'Content migrations into Drupal from WordPress, Fatwire and ezPublish.',
    ],
  },
};

export const Default = {};

export const Study = {
  args: {
    title: 'Higher Vocational Training in Web Application Development',
    organization: 'IES Tetúan de las Victorias',
    startDate: '2012',
    endDate: '2014',
    summary: 'A two-year higher vocational qualification, EQF level 5, covering the client, the server and the database.',
    highlights: [
      'Programming in Java.',
      'Server-side web development with PHP and Java EE.',
    ],
  },
};

export const SummaryOnly = {
  args: {
    highlights: [],
  },
};

// With the organisation's logo above the title.
export const WithLogo = {
  args: {
    image: {
      src: '/200x200.jpg',
      alt: 'Metadrop',
      width: 200,
      height: 200,
    },
  },
};
