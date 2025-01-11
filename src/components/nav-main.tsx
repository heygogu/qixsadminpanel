"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  const realPathMatch = pathname.split("/")[1];
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-semibold">MAIN MENU</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (

          <Collapsible
            key={item.title}
            asChild

            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {/* <CollapsibleTrigger asChild> */}
              <Link href={item.url}>
                <SidebarMenuButton isActive={realPathMatch === item.url?.split("/")[1]} tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span className={realPathMatch === item.url?.split("/")[1] ? "font-semibold" : ""}>{item.title}</span>
                  {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
                </SidebarMenuButton>
              </Link>
              {/* </CollapsibleTrigger> */}
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
