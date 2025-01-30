"use client";

import * as React from "react";
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
  FileCheck,
  Building2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { motion } from "framer-motion";
// import { TeamSwitcher } from "@/components/team-switcher"
import ProjectLogo from "@/app/assets/images/project-logo.png";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Image from "next/image";
import { NavSettings } from "./nav-settings";
import Breadcrumbs from "./common/Breadcrumbs";
import { NavTest } from "./nav-testing";
import { ScrollArea } from "./ui/scroll-area";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Workspaces",
      url: "/workspaces/page/1",
      icon: Building2,
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
      url: "/vendors/page/1",
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
      url: "/accounting/page/1",
      icon: UserRoundPen,
    },
    {
      title: "AI Agents",
      url: "/ai-agents/page/1",
      icon: BotIcon,
    },
  ],
  projects: [
    {
      title: "Ticket Management",
      url: "/ticket-management/page/1",
      icon: TicketCheck,
      items: [],
    },
    {
      title: "White Label Leads",
      url: "/white-label-leads/page/1",
      icon: ShoppingBag,
      items: [],
    },
  ],
  testing: [
    {
      title: "Website Testing",
      url: "/website-testing",
      icon: TestTube2,
      items: [],
    },
    {
      title: "Call Testing",
      url: "/call-testing",
      icon: PhoneIncoming,
      items: [],
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
          icon: FileCheck,
        },
        {
          title: "Staff",
          url: "/settings/staff/page/1",
          icon: UserRoundPen,
        },
        {
          title: "Notifications ",
          url: "/settings/notifications",
          icon: BellIcon,
        },
      ],
    },
  ],
  currentPage: {
    parent: "Home",
    title: "Dashboard",
  },
};

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  return (
    <SidebarProvider>
      <Sidebar className="  " collapsible="icon">
        <SidebarHeader className="flex items-center justify-center mt-2">
          {/* <TeamSwitcher teams={data.teams} /> */}
          <Image
            src={ProjectLogo}
            height={100}
            width={200}
            alt="Project Logo"
            className=""
          ></Image>
        </SidebarHeader>
        <SidebarContent className="mt-[30px]">
          <ScrollArea className="">
            <NavMain items={data.navMain} />
            <NavProjects items={data.projects} />
            <NavSettings projects={data.settings} />
            <NavTest items={data.testing} />
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="">
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 bg-secondary items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center w-full gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <SidebarSeparator orientation="vertical" className="mr-2 h-4" />

            <div className="flex items-center gap-2 flex-1">
              <Breadcrumbs />
              {/* <DropdownMenu>
              <DropdownMenuTrigger asChild> */}

              {/* <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="ml-auto rounded-full" variant="outline" size="icon">
                  <motion.div
                    initial={{ rotate: theme === "light" ? 0 : 90, scale: theme === "light" ? 1 : 0 }}
                    animate={{ rotate: theme === "light" ? 0 : 90, scale: theme === "light" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem]" />
                  </motion.div>
                  <motion.div
                    initial={{ rotate: theme === "light" ? -90 : 0, scale: theme === "light" ? 0 : 1 }}
                    animate={{ rotate: theme === "light" ? -90 : 0, scale: theme === "light" ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                  >
                    <Moon className="h-[1.2rem] w-[1.2rem]" />
                  </motion.div>
                  <span className="sr-only">Toggle theme</span>
                </Button> */}
              {/* </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            </div>
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
  );
}
