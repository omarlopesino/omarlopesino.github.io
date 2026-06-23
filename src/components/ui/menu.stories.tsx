import type { Meta, StoryObj } from '@storybook/react';
import { Menu, MenuLink, Submenu } from './menu';
import { Logo } from './logo';

const meta = {
  title: 'Components/NavigationMenu',
  component: Menu,
  args: {
    logo: (
      <Logo />
    )
  }
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Menu logo={args.logo}>
      <MenuLink href="/about">About</MenuLink>
      <MenuLink href="/blog">Blog</MenuLink>
      <MenuLink href="/contact" className="rounded-lg border border-current">Contact</MenuLink>
    </Menu>
  ),
};

export const Megamenu: Story = {
  render: (args) => (
    <Menu logo={args.logo}>
      <MenuLink href="/about">About</MenuLink>
      <Submenu summary='Blog'>
          <MenuLink href="/blog">All posts</MenuLink>
          <MenuLink href="/ia">Ia</MenuLink>
      </Submenu>
      <MenuLink href="/contact" className="rounded-lg border border-current">Contact</MenuLink>
    </Menu>
  ),
};
