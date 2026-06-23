import * as React from "react"
import { cn } from "@/lib/utils"

function Menu({ className, logo, children, ...props }: React.ComponentProps<"nav"> & {
  logo: React.ReactNode
}) {
  return (
    <nav role="navigation" className={cn(className, 'navbar max-md:flex-col max-md:items-center shadow-sm')} {...props}>
      <div className="flex-2 max-md:pl-0 max-md:w-full max-md:text-center">
        {logo}
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal items-center">
          {children}
        </ul>
      </div>
    </nav>
  )
}

function Submenu({ className, summary, children, ...props }: {
  summary: React.ReactNode,
  children: React.ReactNode,
  className?: string}
) {
  return (
    <li className={cn(className)}>
        <details {...props}>
          <summary>
            {summary}
          </summary>
          <ul className="px-1 w-max">
            {children}
          </ul>
        </details>
    </li>
  )
}

function MenuLink({className, href, children, ...props} : React.ComponentProps<"a">) {
  return (
    <li><a className={className} href={href} {...props}>{children}</a></li>
  )
}

export {
  Menu,
  Submenu,
  MenuLink,
}
