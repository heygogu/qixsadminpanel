"use client";

import * as React from "react";
import {
  LayoutDashboard,
  LibraryBig,
  PhoneIncoming,
  Settings,
  TestTube2,
  BotIcon,
  ShoppingBag,
  UsersRound,
  UserRoundPen,
  TicketCheck,
  BellIcon,
  FileCheck,
  Building2,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import ProjectLogo from "@/app/assets/images/project-logo.png";
import { useTheme } from "next-themes";

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

import Image from "next/image";
import { NavSettings } from "./nav-settings";
import Breadcrumbs from "./common/Breadcrumbs";
import { NavTest } from "./nav-testing";
import { ScrollArea } from "./ui/scroll-area";
import { useGlobalContext } from "@/app/providers/Provider";

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
    },
    {
      title: "Vendors",
      url: "/vendors/page/1",
      icon: UsersRound,
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
    {
      title: "Knowledge Base",
      url: "/knowledgebase",
      icon: LibraryBig,
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
  const { userInfo } = useGlobalContext();

  // Define all possible modules with their metadata
  const allModules = [
    {
      value: "workspaces",
      label: "Workspaces",
      icon: Building2,
      category: "main",
      url: "/workspaces/page/1",
    },
    {
      value: "vendors",
      label: "Vendors",
      icon: UsersRound,
      category: "main",
      url: "/vendors/page/1",
    },
    {
      value: "accounting",
      label: "Accounting",
      icon: UserRoundPen,
      category: "main",
      url: "/accounting/page/1",
    },
    {
      value: "aiagents",
      label: "AI Agents",
      icon: BotIcon,
      category: "main",
      url: "/ai-agents/page/1",
    },
    {
      value: "knowledge-base",
      label: "Knowledge Base",
      icon: LibraryBig,
      category: "main",
      url: "/knowledgebase",
    },
    {
      value: "ticket-management",
      label: "Ticket Management",
      icon: TicketCheck,
      category: "projects",
      url: "/ticket-management/page/1",
    },
    {
      value: "white-label-leads",
      label: "White Label Leads",
      icon: ShoppingBag,
      category: "projects",
      url: "/white-label-leads/page/1",
    },
    {
      value: "website-testing",
      label: "Website Testing",
      icon: TestTube2,
      category: "testing",
      url: "/website-testing",
    },
    {
      value: "call-testing",
      label: "Call Testing",
      icon: PhoneIncoming,
      category: "testing",
      url: "/call-testing",
    },
    {
      value: "settings",
      label: "Settings",
      icon: Settings,
      category: "settings",
      url: "",
    },
  ];

  const permittedModules = userInfo?.module_permission || [];

  // Filter modules based on permissions
  const getModulesByCategory = (category: string) =>
    allModules.filter(
      (module) =>
        module.category === category && permittedModules.includes(module.value)
    );

  // Construct navigation items
  const navMainItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    ...getModulesByCategory("main").map((module) => ({
      title: module.label,
      url: module.url,
      icon: module.icon,
    })),
  ];

  const navProjectItems = getModulesByCategory("projects").map((module) => ({
    title: module.label,
    url: module.url,
    icon: module.icon,
    items: [],
  }));

  const navTestingItems = getModulesByCategory("testing").map((module) => ({
    title: module.label,
    url: module.url,
    icon: module.icon,
    items: [],
  }));

  const settingsItems = permittedModules.includes("settings")
    ? [
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
      ]
    : [];
  return (
    <SidebarProvider>
      <Sidebar className="  " collapsible="icon">
        <SidebarHeader className="flex items-center justify-center mt-2">
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
            {userInfo?.super_admin ? (
              <>
                <NavMain items={data.navMain} />
                <NavProjects items={data.projects} />
                <NavSettings projects={data.settings} />
                <NavTest items={data.testing} />
              </>
            ) : (
              <>
                <NavMain items={navMainItems} />
                {navProjectItems.length > 0 && (
                  <NavProjects items={navProjectItems} />
                )}
                {settingsItems.length > 0 && (
                  <NavSettings projects={settingsItems} />
                )}
                {navTestingItems.length > 0 && (
                  <NavTest items={navTestingItems} />
                )}
              </>
            )}
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
            </div>
          </div>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
