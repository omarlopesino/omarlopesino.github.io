import DateInterval from "./DateInterval.astro";
export default {
  title: 'Components/DateInterval',
  component: DateInterval,
  args:  {
    date_a: '2026-06',
    date_b: '2026-07',
  },
};
export const Default = {};

export const Years = {
  args: {
    date_a: '2014',
    date_b: 'Now',
    class: 'opacity-70',
  },
};
