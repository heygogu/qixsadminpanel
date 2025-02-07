"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import henceforthApi from "@/utils/henceforthApis";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Bot,
  EyeIcon,
  Info,
  PencilIcon,
  Plus,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PaginationCompo from "@/components/common/Pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalContext } from "@/app/providers/Provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function AgentsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const { Toast } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [aiAgents, setAiAgents] = useState({
    data: [],
    count: 0,
  });

  const getAgentsListing = async () => {
    setLoading(true);
    try {
      let urlSearchParam = new URLSearchParams();

      if (params?.pagination) {
        urlSearchParam.set(
          "pagination",
          String(Number(params?.pagination) - 1) || "0"
        );
      }
      if (searchParams.get("search")) {
        urlSearchParam.set("search", String(searchParams.get("search")));
      }
      if (searchParams.get("limit")) {
        urlSearchParam.set("limit", searchParams.get("limit") as string);
      } else {
        urlSearchParam.set("limit", String(10));
      }
      const apiRes = await henceforthApi.SuperAdmin.agentTemplateListing(
        urlSearchParam.toString()
      );
      console.log(apiRes?.data, "apiRes?.data");
      setAiAgents({
        data: apiRes?.data?.data,
        count: apiRes?.data?.count,
      });
    } catch (error) {
      console.error("Failed to fetch agents listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await henceforthApi.SuperAdmin.deleteAgentTemplate(id);
      Toast.success("Agent deleted successfully");
      getAgentsListing();
    } catch (error) {
      Toast.error("Failed to delete agent");
    }
  };

  const columns: any = [
    {
      header: "Sr No",
      cell: ({ row }: { row: any }) => {
        const currentPage = Number(params?.pagination) || 1;
        const pageSize = Number(searchParams.get("limit")) || 10;
        return Number(currentPage - 1) * pageSize + (row.index + 1);
      },
    },
    {
      accessorKey: "name",
      header: "Agent",
      cell: ({ row }: { row: any }) => {
        const agent = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="w-10 border-2 shadow-lg border-primary/50  h-10">
              <AvatarImage
                className="h-full object-cover w-full"
                src={henceforthApi.FILES.imageOriginal(agent?.image)}
              />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{agent.name}</div>
              <div className="text-sm text-muted-foreground">{agent.type}</div>
            </div>
          </div>
        );
      },
    },

    {
      header: "Phone Number",
      cell: ({ row }: { row: any }) => {
        return <div>{row?.original?.twilio_config?.phone_number ?? "N/A"}</div>;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: { row: any }) => {
        return <div>{row.getValue("type")}</div>;
      },
    },
    {
      accessorKey: "voice",
      header: "Voice",
      cell: ({ row }: { row: any }) => {
        const voiceLabels: { [key: string]: string } = {
          "aura-asteria-en": "Asteria (English - US, Female)",
          "aura-luna-en": "Luna (English - US, Female)",
          "aura-stella-en": "Stella (English - US, Female)",
          "aura-athena-en": "Athena (English - UK, Female)",
          "aura-hera-en": "Hera (English - US, Female)",
          "aura-orion-en": "Orion (English - US, Male)",
          "aura-arcas-en": "Arcas (English - US, Male)",
          "aura-perseus-en": "Perseus (English - US, Male)",
          "aura-angus-en": "Angus (English - Ireland, Male)",
          "aura-orpheus-en": "Orpheus (English - US, Male)",
          "aura-helios-en": "Helios (English - UK, Male)",
          "aura-zeus-en": "Zeus (English - US, Male)",
        };

        const voiceValue = row.getValue("voice");
        return <div>{voiceLabels[voiceValue] ?? "N/A"}</div>;
      },
    },

    {
      header: "Action",
      id: "actions",
      cell: ({ row }: { row: any }) => {
        return (
          <div className="space-x-2">
            <Link
              href={`/ai-agents/edit/agent-template/${row.original?._id}`}
              passHref
            >
              <Button variant="outline">
                <PencilIcon className=" text-gray-600 h-5 w-5 " />
              </Button>
            </Link>
            <Button
              variant={"outline"}
              onClick={() => handleDelete(row.original?._id)}
            >
              <Trash2 className="text-gray-600 h-5 w-5" />
            </Button>
          </div>
        );
        // const agent = row.original;
        // return (
        //   <DropdownMenu>
        //     <DropdownMenuTrigger asChild>
        //       <Button variant="ghost" className="h-8 w-8 p-0">
        //         <MoreHorizontal className="h-4 w-4" />
        //       </Button>
        //     </DropdownMenuTrigger>
        //     <DropdownMenuContent align="end" className="bg-white">
        //       <DropdownMenuLabel className="text-center p-0 pt-1">Actions</DropdownMenuLabel>
        //       <DropdownMenuSeparator />
        //       <DropdownMenuItem className="text-gray-500" >
        //        <Link href="/aiagents/123/view"><span className="inline-flex"><Eye className="mr-2 h-4 w-4 " /> View Details</span></Link>
        //       </DropdownMenuItem >
        //       <DropdownMenuItem className="text-green-500">
        //         <Phone className="mr-2 h-4 w-4 " /> Start Call
        //       </DropdownMenuItem >
        //       <DropdownMenuItem className="text-blue-500"><Pencil className="mr-2 h-4 w-4 "/>  Edit Agent</DropdownMenuItem>
        //       <DropdownMenuItem className="text-red-500">
        //        <Trash2 className="mr-2 h-4 w-4 "/> Delete Agent
        //       </DropdownMenuItem>
        //     </DropdownMenuContent>
        //   </DropdownMenu>
        // );
      },
    },
  ];

  const handlePageChange = (page: number) => {
    const query = new URLSearchParams(searchParams?.toString());
    router.replace(`/ai-agents/page/${page}?${query.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    getAgentsListing();
  }, []);

  // const showInitialView = !loading && aiAgents?.count === 0;

  // if (showInitialView) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
  //       <div className="container mx-auto py-8 max-w-7xl px-4">
  //         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
  //           <AgentCreationCards />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  const skeletonColumns = columns.map((column: any) => ({
    ...column,
    cell: () => <Skeleton className="h-6 w-full" />,
  }));

  return (
    <PageContainer>
      <div
        className={cn(
          "animate-in fade-in-50 grid grid-cols-1 duration-500 ",
          "slide-in-from-bottom-5"
        )}
      >
        <Card className="transition-all duration-300 col-span-12">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Bot className="h-7 w-7" />
                  <CardTitle className="text-2xl">AI Agents</CardTitle>
                </div>
                <CardDescription>
                  Manage and monitor your AI agent
                </CardDescription>
              </div>
              <Link href="/ai-agents/create/agent-template" passHref>
                <Button className="bg-primary text-white ">
                  <UserPlus className=" h-4 w-4" /> Create Agent
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {loading ? (
                <div className="mx-auto">
                  <DataTable
                    columns={skeletonColumns}
                    data={Array.from({ length: 8 }, (_, index) => ({ index }))}
                    totalItems={8}
                  />
                </div>
              ) : (
                <div className="mx-auto ">
                  <DataTable
                    columns={columns}
                    data={aiAgents?.data}
                    totalItems={0}
                  />
                  <PaginationCompo
                    currentPage={Number(params?.pagination) || 1}
                    itemsPerPage={Number(searchParams.get("limit")) || 10}
                    totalDataCount={aiAgents?.count}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <AgentsPage />
    </DashboardLayout>
  );
}
