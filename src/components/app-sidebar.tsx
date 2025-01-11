"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  LibraryBig,
  PhoneIncoming,
  MessagesSquare,
  Settings,
  TestTube2,
  BotIcon,
  ShoppingBag,
  UsersRound,


  CreditCard,
  UserRoundPen,
  Ticket,
  TicketCheck,
  Users2,
  BellIcon,
  PaperclipIcon,
  FileCheck
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
// import { TeamSwitcher } from "@/components/team-switcher"
import ProjectLogo from "@/app/assets/images/project-logo.png"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import Image from "next/image"
import { NavSettings } from "./nav-settings"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,

    },
    {
      title: "Workspaces",
      url: "/workspaces",
      icon: ShoppingBag,
      // items: [
      //   {
      //     title: "Genesis",
      //     url: "#",
      //   },
      //   {
      //     title: "Explorer",
      //     url: "#",
      //   },
      //   {
      //     title: "Quantum",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Vendors",
      url: "/vendors",
      icon: UsersRound,
      // items: [
      //   {
      //     title: "Introduction",
      //     url: "#",
      //   },
      //   {
      //     title: "Get Started",
      //     url: "#",
      //   },
      //   {
      //     title: "Tutorials",
      //     url: "#",
      //   },
      //   {
      //     title: "Changelog",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Accounting",
      url: "/accounting",
      icon: UserRoundPen,
      // items: [
      //   {
      //     title: "General",
      //     url: "#",
      //   },
      //   {
      //     title: "Team",
      //     url: "#",
      //   },
      //   {
      //     title: "Billing",
      //     url: "#",
      //   },
      //   {
      //     title: "Limits",
      //     url: "#",
      //   },
      // ],
    },

  ],
  projects: [
    {
      name: "Ticket Management",
      url: "/ticket-management",
      icon: TicketCheck,
      items: []
    },

  ],
  settings: [
    {
      name: "Settings",
      url: "",
      icon: Settings,
      items: [
        {
          title: "Page Management",
          url: "/settings/page-management",
          icon: FileCheck
        },
        {
          title: "Staff",
          url: "/settings/staff",
          icon: UserRoundPen
        },
        {
          title: "Notifications ",
          url: "/settings/notifications",
          icon: BellIcon,
        }
      ]
    }

  ],
  currentPage: {
    parent: "Home",
    title: "Dashboard",
  },
}

export function AppSidebar({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className=''>

      <Sidebar collapsible="icon" >
        <SidebarHeader className="flex items-center justify-center mt-2">
          {/* <TeamSwitcher teams={data.teams} /> */}
          <Image src={ProjectLogo} height={100} width={200} alt="Project Logo" className="" ></Image>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.projects} />
          <NavSettings projects={data.settings} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 bg-secondary items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <SidebarSeparator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {data.currentPage.parent}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{data.currentPage.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div> */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
