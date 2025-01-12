"use client"

import {
  ChevronRight,

  type LucideIcon,
} from "lucide-react"


import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: any
  }[]
}) {
  const { isMobile } = useSidebar(); // Assuming useSidebar hook exists
  const pathname = usePathname(); // Get the current path from Next.js routing
  const pathSegments = pathname.split('/'); // Split pathname to check individual segments

  // Extract the base path for easier matching (this assumes single-level or flat URL structure)
  const realPathMatch = pathSegments[1]; // Get the first segment after "/"

  console.log(pathname, realPathMatch); // Debug output to check path values

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="font-semibold">SUPPORT</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          item.items?.length > 0 ? (
            // Collapsible item (Settings)
            <Collapsible
              key={item.name}
              asChild
              defaultOpen={pathname.startsWith('/settings')} // Check if the current path is under "/settings"
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={pathname.startsWith('/settings')} // Highlight if the current path starts with "/settings"
                    tooltip={item.name}
                  >
                    {item.icon && <item.icon />}
                    <Link href={item.url}>
                      <span
                        className={pathname.startsWith('/settings') ? 'font-semibold' : ''}
                      >
                        {item.name}
                      </span>
                    </Link>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a
                            href={subItem.url}
                            className={pathname === subItem.url ? 'font-semibold' : ''}
                          >
                            <subItem.icon />
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // Non-collapsible item
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                isActive={realPathMatch === item.url.split('/')[1]} // Compare first segments
                asChild
              >
                <Link href={item.url}>
                  <item.icon />
                  <span
                    className={realPathMatch === item.url.split('/')[1] ? 'font-semibold' : ''}
                  >
                    {item.name}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}