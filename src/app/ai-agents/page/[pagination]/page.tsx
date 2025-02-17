"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import henceforthApi from "@/utils/henceforthApis";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Copy,
  EyeIcon,
  Info,
  PencilIcon,
  Trash2,
  User,
  UserPlus,
} from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PaginationCompo from "@/components/common/Pagination";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { text } from "@/utils/ScriptString";
import CodeBlockDemo from "@/components/common/CodeBlock";

function AgentsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { Toast } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [aiAgents, setAiAgents] = useState({
    data: [],
    count: 0,
  });
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [isScriptExpanded, setIsScriptExpanded] = useState(false);
  const [selectedScript, setSelectedScript] = useState("");

  const openScriptModal = (token: string) => {
    setSelectedScript(token);
    setIsScriptModalOpen(true);
    setIsScriptExpanded(false);
  };
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

  const generateToken = (row: any) => {
    const token = Buffer.from(
      JSON.stringify({
        agent_id: row.original?._id,
      })
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return token;
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
        return <span>{row.getValue("type")}</span>;
      },
    },
    {
      header: "Agent Status",
      accessorKey: "status",
      cell: ({ row }: { row: any }) => (
        <Badge
          className={`rounded-xl text-white font-medium ${
            row.original?.status === "ACTIVE"
              ? "bg-green-400"
              : row.original?.status === "IN_ACTIVE"
              ? "bg-yellow-400"
              : "bg-yellow-400"
          }`}
        >
          {row.original?.status === "ACTIVE"
            ? "Active"
            : row.original?.status === "IN_ACTIVE"
            ? "Inactive"
            : "Inactive"}
        </Badge>
      ),
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
      header: "Script ID",
      accessorKey: "_id",
      cell: ({ row }: any) => (
        <div>
          <Tooltip>
            <TooltipTrigger>
              <span>
                {!row.original?.script
                  ? "N/A"
                  : `${row.original?.script?._id?.slice(
                      0,
                      4
                    )}...${row.original?.script?._id.slice(-4)}`}
              </span>
            </TooltipTrigger>
            <TooltipContent align="center" sideOffset={-50}>
              <span>{row.original?.script?._id || "N/A"}</span>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
    // {
    //   header: "Name",
    //   accessorKey: "title",
    // },

    {
      // accessorKey: "pageLink",
      header: "Chat Page",
      cell: ({ row }: { row: any }) => {
        const token = generateToken(row);

        if (!token) {
          return <span className="text-red-500">Error generating link</span>;
        }
        if (!row.original?.script) {
          return <span>N/A</span>;
        }

        return (
          <div className="font-medium">
            <Link
              href={`${process.env.NEXT_PUBLIC_DEV_CHAT_LINK}/form?token=${token}`}
              target="_blank"
              className={`${
                row.original?.script_status === "IN_ACTIVE"
                  ? "pointer-events-none opacity-50"
                  : ""
              } text-blue-500 underline hover:text-blue-700`}
            >
              View Page
            </Link>
          </div>
        );
      },
    },
    {
      header: "Chatbot Script",
      cell: ({ row }: { row: any }) => {
        const token = generateToken(row);
        if (!row.original?.script) {
          return <span>N/A</span>;
        }
        return (
          <Button
            disabled={row.original?.script_status === "IN_ACTIVE"}
            onClick={() => openScriptModal(token)}
            className="bg-primary text-white p-0 px-2"
          >
            <span>View Script</span>
          </Button>
        );
      },
    },

    {
      header: "Script Status",

      cell: ({ row }: { row: any }) => {
        if (!row.original?.script) {
          return "N/A";
        }
        return (
          <Badge
            className={`rounded-xl text-white font-medium ${
              row.original?.script?.script_status === "ACTIVE"
                ? "bg-blue-400"
                : row.original?.script?.script_status === "IN_ACTIVE"
                ? "bg-yellow-400"
                : "bg-blue-400"
            }`}
          >
            {row.original?.script?.script_status === "ACTIVE"
              ? "Active"
              : row.original?.script?.script_status === "IN_ACTIVE"
              ? "Inactive"
              : "Paused"}
          </Badge>
        );
      },
    },

    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: ({ row }) => {
    //     const status = row.getValue("status") as string;
    //     return (
    //       <Badge
    //         variant="outline"
    //         className={            status === "online"
    //             ? "bg-green-50 text-green-700 border-green-200"
    //             : status === "busy"
    //             ? "bg-yellow-50 text-yellow-700 border-yellow-200"
    //             : "bg-gray-50 text-gray-700 border-gray-200"
    //         }
    //       >
    //        <span className="capitalize">{status}</span>
    //       </Badge>
    //     );
    //   },
    // },
    // {
    //   accessorKey: "model",
    //   header: "Model",
    // },
    {
      accessorKey: "call_list",
      header: () => {
        return (
          <Tooltip>
            <TooltipTrigger className="flex items-center">
              <span>Total TCs</span>
              <Info className="h-5 w-5 text-white ml-2 mb-[2px]" />
            </TooltipTrigger>
            <TooltipContent sideOffset={15}>Telephonic Calls</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "voice_chat_count",
      header: () => {
        return (
          <Tooltip>
            <TooltipTrigger className="flex items-center">
              <span>Total VCs</span>
              <Info className="h-5 w-5 text-white ml-2 mb-[2px]" />
            </TooltipTrigger>
            <TooltipContent sideOffset={15}>Voice Chats</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "chat_count",
      header: "Total Chats",
    },

    {
      header: "Action",
      id: "actions",
      cell: ({ row }: { row: any }) => {
        return (
          <div className="space-x-2">
            <Link href={`/ai-agents/${row.original?._id}/view`} passHref>
              <Button variant="outline">
                <EyeIcon className="text-gray-600 h-5 w-5" />
              </Button>
            </Link>
            {/* <Link
              href={`/ai-agents/edit/agent-template/${row.original?._id}`}
              passHref
            >
              <Button variant="outline">
                <PencilIcon className=" text-gray-600 h-5 w-5 " />
              </Button>
            </Link> */}
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

      <Dialog open={isScriptModalOpen} onOpenChange={setIsScriptModalOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Chatbot Script</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex flex-col gap-2 mb-4">
              <Label>CDN Links</Label>
              <p className="text-sm text-gray-600">
                Embed these in the body/head of your project's HTML:
              </p>
              <div className="flex items-center w-full">
                {/* <Input
                  className="flex-1"
                  value={`<script src="${process.env.NEXT_PUBLIC_DEV_BOT_CDN_LINK}?token=${selectedScript}"></script>`}
                  readOnly
                />
                <Button
                  className="ml-2"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `<script src="${process.env.NEXT_PUBLIC_DEV_BOT_CDN_LINK}?token=${selectedScript}"></script>`
                    );
                    Toast.success("Chatbot script copied");
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button> */}
                <CodeBlockDemo
                  code={`<script src="https://cdn.jsdelivr.net/npm/@deepgram/sdk"></script><script src="${process.env.NEXT_PUBLIC_DEV_BOT_CDN_LINK}?token=${selectedScript}"></script>`}
                />
              </div>
            </div>
            <div className=" max-w-3xl mt-5 flex flex-col gap-2 overflow-y-auto">
              <div className="flex items-center justify-between">
                <Label>Chatbot Script</Label>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsScriptExpanded(!isScriptExpanded)}
                >
                  {isScriptExpanded ? (
                    <>
                      Collapse{" "}
                      <ChevronUp className="w-4 h-4 ml-1 text-red-500" />
                    </>
                  ) : (
                    <>
                      Expand{" "}
                      <ChevronDown className="w-4 h-4 ml-1 text-green-500" />
                    </>
                  )}
                </Button>
              </div>
              <AnimatePresence>
                {isScriptExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Textarea
                      className="w-full h-96 p-2 rounded-md mt-2"
                      value={text}
                      readOnly
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <DialogFooter>
            <Button
              className={!isScriptExpanded ? "mt-5" : ""}
              variant="outline"
              onClick={() => setIsScriptModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
