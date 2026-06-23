import { Menu, MenuLink } from "@/components/ui/menu"
import { Logo } from "@/components/ui/logo"

function SiteHeader() {
  return (
    <Menu logo={<Logo />}>
      <MenuLink href="/about">About</MenuLink>
      <MenuLink href="/blog">Blog</MenuLink>
      <MenuLink href="/contact" className="px-4 rounded-lg border border-current">Contact</MenuLink>
    </Menu>
  )
}

export { SiteHeader }
