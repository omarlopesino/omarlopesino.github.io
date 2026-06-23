import Menu from './Menu.astro';

export default {
  title: 'Components/NavigationMenu',
  component: Menu,
};

const logo =
  '<a href="/" class="text-xl font-bold text-base-content hover:opacity-80 p-4">Omar Lopesino</a>';

export const Default = {
  args: {
    slots: {
      logo,
      default: `
        <li><a href="/about">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact" class="px-4 rounded-lg border border-current">Contact</a></li>
      `,
    },
  },
};

export const Megamenu = {
  args: {
    slots: {
      logo,
      default: `
        <li><a href="/about">About</a></li>
        <li>
          <details>
            <summary>Blog</summary>
            <ul class="px-1 w-max">
              <li><a href="/blog">All posts</a></li>
              <li><a href="/ia">Ia</a></li>
            </ul>
          </details>
        </li>
        <li><a href="/contact" class="px-4 rounded-lg border border-current">Contact</a></li>
      `,
    },
  },
};
