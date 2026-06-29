import Table from "./Table.astro";
export default {
  title: 'Components/Table',
  component: Table,
  args:  {
    header: ['One', 'Two', 'Three'],
    rows: [
      {
        head: '1',
        cells: ['Test', 'Test'],
      },
      {
        head: '2',
        cells: ['Test', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'],
      }
    ],
  },
};
export const Default = {};
