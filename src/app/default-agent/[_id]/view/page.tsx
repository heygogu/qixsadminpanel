"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Phone,
  MessageSquare,
  PhoneCall,
  User,
  Pencil,
  Eye,
  PhoneIncoming,
  EyeIcon,
  Podcast,
  Send,
  Cpu,
  Mic,
  LibraryBig,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layouts/dashboard-layout";

import { Tooltip as T, TooltipContent } from "@/components/ui/tooltip";

import PageContainer from "@/components/layouts/page-container";
import henceforthApi from "@/utils/henceforthApis";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/common/data-table";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useGlobalContext } from "@/app/providers/Provider";

import PaginationCompo from "@/components/common/Pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmotionDashboard from "./EmotionDashboard";
import { Skeleton } from "@/components/ui/skeleton";

dayjs.extend(duration);

const AgentCardSkeleton = () => {
  return (
    <Card className="w-full bg-white rounded-xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Avatar Skeleton */}
        <Skeleton className="w-28 h-28  rounded-full" />

        <div className="flex-1 space-y-6 w-full">
          {/* Name and Badge Row */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-32" /> {/* Name */}
            <Skeleton className="h-6 w-16" /> {/* Badge */}
          </div>

          {/* Details Row */}
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-5 w-20" /> {/* Phone */}
            <div className="hidden sm:block text-gray-300">|</div>
            <Skeleton className="h-5 w-32" /> {/* Model */}
            <div className="hidden sm:block text-gray-300">|</div>
            <Skeleton className="h-5 w-64" /> {/* Voice */}
          </div>

          {/* Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Skeleton className="h-10 rounded-lg" /> {/* Chat Prompt */}
            <Skeleton className="h-10 rounded-lg" /> {/* Call Prompt */}
            <Skeleton className="h-10 rounded-lg" /> {/* Knowledge Bases */}
            <Skeleton className="h-10 rounded-lg" /> {/* Edit Agent */}
          </div>
        </div>
      </div>
    </Card>
  );
};

const AgentDashboard = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  console.log(params?._id, "params?._id");
  const router = useRouter();
  const { Toast, userInfo } = useGlobalContext();
  const [agentInfo, setAgentInfo] = React.useState<any>();
  const [agentLoading, setAgentLoading] = React.useState<boolean>(true);
  const { formatDuration } = useGlobalContext();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [callLogs, setCallLogs] = React.useState<any>({
    data: [],
    count: 0,
  });

  const [chatLogs, setChatLogs] = React.useState<any>({
    data: [],
    count: 0,
  });

  const [voiceChatLogs, setVoiceChatLogs] = React.useState<any>({
    data: [],
    count: 0,
  });

  console.log(agentInfo, "agentInfo");

  const activateDeactivateAgent = async () => {
    try {
      await henceforthApi.SuperAdmin.updateAgentStatus(
        String(params?._id),
        agentInfo?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      );
      getAgentDetails();
    } catch (error) {
      console.error("Failed to update agent status:", error);
    }
  };

  const handleScriptDeactivate = async () => {
    const script_id = agentInfo?.script_data?._id;

    const payload: { script_status: string } = {
      script_status:
        agentInfo?.script_data?.script_status === "ACTIVE"
          ? "IN_ACTIVE"
          : "ACTIVE",
    };

    try {
      const apiRes = await henceforthApi?.SuperAdmin?.deactivateScript(
        userInfo?.workspace?._id,
        script_id,
        payload
      );
      getAgentDetails();
      if (payload.script_status === "IN_ACTIVE") {
        Toast.success("Script deactivated successfully");
      } else {
        Toast.success("Script activated successfully");
      }
    } catch (error: any) {
      Toast.error(error);
    }
  };

  const handleCallPageChange = (page: number) => {
    const query = new URLSearchParams(searchParams?.toString());
    // query.set("limit", "10");
    query.set("callPage", String(page));

    router.replace(`/default-agent/${params?._id}/view?${query.toString()}`, {
      scroll: false,
    });
  };

  const handleChatPageChange = (page: number) => {
    const query = new URLSearchParams(searchParams?.toString());
    // query.set("limit", "10");
    query.set("chatPage", String(page));
    router.replace(`/default-agent/${params?._id}/view?${query.toString()}`, {
      scroll: false,
    });
  };

  const handleVoiceChatPageChange = (page: number) => {
    const query = new URLSearchParams(searchParams?.toString());
    // query.set("limit", "10");
    query.set("voiceChatPage", String(page));
    router.replace(`/default-agent/${params?._id}/view?${query.toString()}`, {
      scroll: false,
    });
  };

  const callLogsColumns: any = [
    {
      header: "Sr. No.",
      cell: ({ row }: { row: { index: number } }) => {
        const currentPage = Number(searchParams.get("callPage")) || 1;
        const pageSize = Number(searchParams.get("limit")) || 10;
        return Number((currentPage - 1) * pageSize + (row.index + 1));
      },
    },
    // {
    //   accessorKey: "ai_agent",
    //   header: "AI Agent",
    //   cell: ({ row }: { row: any }) => {
    //     const agent = row.original?.agent_id;
    //     return (
    //       <div className="flex items-center gap-2">
    //         <Avatar className="w-8 h-8">
    //           <AvatarImage src={henceforthApi?.FILES.imageOriginal(agent?.image) || '/default-avatar.png'} />
    //           <AvatarFallback><User className="w-4 h-4"/></AvatarFallback>
    //         </Avatar>
    //         <span>{agent?.name || 'Emma'}</span>
    //       </div>
    //     );
    //   }
    // },

    {
      header: "Phone Number",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <span>{row.original?.phone_no || "John Doe"}</span>
        </div>
      ),
    },

    {
      accessorKey: "Call Duration",
      header: "Call Duration",
      cell: ({ row }: { row: { original: { call_duration: number } } }) => (
        <div className="">{formatDuration(row.original.call_duration)}</div>
      ),
    },
    {
      accessorKey: "summary",
      header: "Summary",
      cell: ({ row }: { row: any }) => {
        return (
          <div>
            <p className="font-normal">
              {row.original?.summary?.length
                ? row.original?.summary?.length > 20
                  ? row.original?.summary?.slice(0, 20) + "..."
                  : row.original?.summary
                : "N/A"}
            </p>
          </div>
        );
      },
    },

    {
      header: "Emotion",
      cell: ({ row }: { row: any }) => {
        const emotionMap = new Map([
          ["customer satisfied", "😊"],
          ["customer frustrated", "😤"],
          ["customer angry", "😠"],
          ["customer interested", "🤔"],
          ["customer uninterested", "😒"],
          ["customer indifferent", "😐"],
        ]);

        const getEmoji = (emotion: string | null | undefined) => {
          if (!emotion) return "😊";

          // Clean up the input string
          const normalizedEmotion = emotion
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " "); // Handle multiple spaces

          return emotionMap.get(normalizedEmotion) || "😊";
        };

        const emotion = row.original?.emotion;

        return (
          <div className="flex items-center gap-2">
            <span className="text-xl">{getEmoji(emotion)}</span>
            <span>{emotion || "Neutral"}</span>
          </div>
        );
      },
    },
    {
      header: "Call Type",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <PhoneIncoming className="h-5 w-5 text-blue-500" />
          <span>{row.original?.call_type || "Incoming"}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        return (
          <Badge
            className={`rounded-xl text-white font-medium ${
              row.original.status === "ACTIVE" ? "bg-blue-400" : "bg-green-500"
            }`}
          >
            {row.original.status === "ACTIVE" ? "Active" : "Completed"}
          </Badge>
        );
      },
    },

    {
      header: "Date and Time",
      cell: ({ row }: { row: any }) => (
        <div className="">
          {dayjs(row.original.created_at).format("DD MMM YYYY")}
        </div>
      ),
    },

    {
      id: "actions",
      header: "Action",
      cell: ({ row }: { row: { index: number; original: any } }) => {
        return (
          <Link href={`/call-management/${row.original?._id}/view`} passHref>
            <Button variant="ghost">
              <EyeIcon color="gray" />
            </Button>
          </Link>
        );
      },
    },
  ];

  const chatLogsColumns: any = [
    {
      header: "Sr. No.",
      cell: ({ row }: { row: { index: number; original: any } }) => {
        const currentPage = Number(searchParams.get("chatPage")) || 1;
        const pageSize = Number(searchParams.get("limit")) || 10;
        return Number((currentPage - 1) * pageSize + (row.index + 1));
      },
    },
    // {
    //   accessorKey: "ai_agent",
    //   header: "AI Agent",
    //   cell: ({ row }: { row: any }) => {
    //     const agent = row.original?.agent_id;
    //     return (
    //       <div className="flex items-center gap-2">
    //         <Avatar className="w-8 h-8 border border-blue-950">
    //           <AvatarImage className="object-cover" src={henceforthApi.FILES.imageOriginal(agent?.image) || '/default-avatar.png'} />
    //           <AvatarFallback><User className="w-4 h-4"/></AvatarFallback>
    //         </Avatar>
    //         <span>{agent?.name || 'Emma'}</span>
    //       </div>
    //     );
    //   }
    // },

    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }: { row: any }) => {
        return <span>{row.original?.name || "N/A"}</span>;
      },
    },

    {
      accessorKey: "email",
      header: "Customer Email",
      cell: ({ row }: { row: any }) => {
        return <span>{row.original?.email || "N/A"}</span>;
      },
    },

    {
      accessorKey: "phone_no",
      header: "Customer Phone ",
      cell: ({ row }: { row: any }) => {
        return <span>{row.original?.phone_no || "N/A"}</span>;
      },
    },

    {
      accessorKey: "last_message",
      header: "Last Message",
      cell: ({ row }: { row: any }) => {
        return (
          <div>
            <p className="font-normal">
              {row.original?.last_message
                ? row.original?.last_message?.length > 20
                  ? row.original?.last_message?.slice(0, 20) + "..."
                  : row.original.last_message
                : "N/A"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Duration",
      cell: ({ row }: { row: any }) => {
        const createdAt = dayjs(row.original?.created_at);
        const updatedAt = dayjs(row.original?.updated_at);
        const durationInSeconds = updatedAt.diff(createdAt, "second");
        const duration = dayjs.duration(durationInSeconds, "seconds");
        return (
          <span>
            {duration.hours() > 0 ? `${duration.hours()}h ` : ""}
            {duration.minutes() > 0 ? `${duration.minutes()}m ` : ""}
            {duration.seconds() > 0 ? `${duration.seconds()}s` : ""}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        return (
          <Badge
            className={`rounded-xl text-white font-medium ${
              row.original.status === "ACTIVE" ? "bg-blue-400" : "bg-green-500"
            }`}
          >
            {row.original.status === "ACTIVE" ? "Active" : "Completed"}
          </Badge>
        );
      },
    },

    {
      header: "Emotion",
      cell: ({ row }: { row: any }) => {
        const emotionMap = new Map([
          ["customer satisfied", "😊"],
          ["customer frustrated", "😤"],
          ["customer angry", "😠"],
          ["customer interested", "🤔"],
          ["customer uninterested", "😒"],
          ["customer indifferent", "😐"],
        ]);

        const getEmoji = (emotion: string | null | undefined) => {
          if (!emotion) return "😊";

          // Clean up the input string
          const normalizedEmotion = emotion
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " "); // Handle multiple spaces

          return emotionMap.get(normalizedEmotion) || "😊";
        };

        const emotion = row.original?.emotion;

        return (
          <div className="flex items-center gap-2">
            <span className="text-xl">{getEmoji(emotion)}</span>
            <span>{emotion || "Neutral"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date and Time",
      cell: ({ row }: { row: any }) => {
        return (
          <span>
            {dayjs(row.original?.created_at).format("DD MMM YYYY") || "N/A"}
          </span>
        );
      },
    },

    {
      accessorKey: "chat",
      header: "Action",
      cell: ({ row }: { row: { index: number; original: any } }) => {
        return (
          <Link href={`/conversations/chat/${row.original._id}/view`} passHref>
            <Button variant="ghost">
              <EyeIcon color="gray" />
            </Button>
          </Link>
        );
      },
    },
  ];

  const voiceChatLogsColumns: any = [
    {
      header: "Sr. No.",
      cell: ({ row }: { row: { index: number; original: any } }) => {
        const currentPage = Number(searchParams.get("voiceChatPage")) || 1;
        const pageSize = Number(searchParams.get("limit")) || 10;
        return Number((currentPage - 1) * pageSize + (row.index + 1));
      },
    },
    // {
    //   accessorKey: "ai_agent",
    //   header: "AI Agent",
    //   cell: ({ row }: { row: any }) => {
    //     const agent = row.original?.agent_id;
    //     return (
    //       <div className="flex items-center gap-2">
    //         <Avatar className="w-8 h-8 border border-blue-950">
    //           <AvatarImage className="object-cover" src={henceforthApi.FILES.imageOriginal(agent?.image) || '/default-avatar.png'} />
    //           <AvatarFallback><User className="w-4 h-4"/></AvatarFallback>
    //         </Avatar>
    //         <span>{agent?.name || 'Emma'}</span>
    //       </div>
    //     );
    //   }
    // },

    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }: { row: any }) => {
        return <span>{row.original?.name || "N/A"}</span>;
      },
    },

    {
      accessorKey: "email",
      header: "Customer Email",
      cell: ({ row }: { row: any }) => {
        return <span>{row.original?.email || "N/A"}</span>;
      },
    },

    {
      accessorKey: "phone_no",
      header: "Customer Phone ",
      cell: ({ row }: { row: any }) => {
        return <span>{row.original?.phone_no || "N/A"}</span>;
      },
    },

    {
      accessorKey: "last_message",
      header: "Last Message",
      cell: ({ row }: { row: any }) => {
        return (
          <div>
            <p className="font-normal">
              {row.original?.last_message
                ? row.original?.last_message?.length > 20
                  ? row.original?.last_message?.slice(0, 20) + "..."
                  : row.original.last_message
                : "N/A"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Duration",
      cell: ({ row }: { row: any }) => {
        const createdAt = dayjs(row.original?.created_at);
        const updatedAt = dayjs(row.original?.updated_at);
        const durationInSeconds = updatedAt.diff(createdAt, "second");
        const duration = dayjs.duration(durationInSeconds, "seconds");
        return (
          <span>
            {duration.hours() > 0 ? `${duration.hours()}h ` : ""}
            {duration.minutes() > 0 ? `${duration.minutes()}m ` : ""}
            {duration.seconds() > 0 ? `${duration.seconds()}s` : ""}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        return (
          <Badge
            className={`rounded-xl text-white font-medium ${
              row.original.status === "ACTIVE" ? "bg-blue-400" : "bg-green-500"
            }`}
          >
            {row.original.status === "ACTIVE" ? "Active" : "Completed"}
          </Badge>
        );
      },
    },

    {
      header: "Emotion",
      cell: ({ row }: { row: any }) => {
        const emotionMap = new Map([
          ["customer satisfied", "😊"],
          ["customer frustrated", "😤"],
          ["customer angry", "😠"],
          ["customer interested", "🤔"],
          ["customer uninterested", "😒"],
          ["customer indifferent", "😐"],
        ]);

        const getEmoji = (emotion: string | null | undefined) => {
          if (!emotion) return "😊";

          // Clean up the input string
          const normalizedEmotion = emotion
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " "); // Handle multiple spaces

          return emotionMap.get(normalizedEmotion) || "😊";
        };

        const emotion = row.original?.emotion;

        return (
          <div className="flex items-center gap-2">
            <span className="text-xl">{getEmoji(emotion)}</span>
            <span>{emotion || "Neutral"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date and Time",
      cell: ({ row }: { row: any }) => {
        return (
          <span>
            {dayjs(row.original?.created_at).format("DD MMM YYYY") || "N/A"}
          </span>
        );
      },
    },

    {
      accessorKey: "chat",
      header: "Action",
      cell: ({ row }: { row: { index: number; original: any } }) => {
        return (
          <Link
            href={`/conversations/voice-calls/${row.original._id}/view`}
            passHref
          >
            <Button variant="ghost">
              <EyeIcon color="gray" />
            </Button>
          </Link>
        );
      },
    },
  ];

  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [isVoiceChatLoading, setIsVoiceChatLoading] = useState<boolean>(false);

  const initChatVoiceLogs = async () => {
    setIsVoiceChatLoading(true);
    try {
      let urlSearchParam = new URLSearchParams();

      if (searchParams.get("voiceChatPage")) {
        urlSearchParam.set(
          "pagination",
          String(Number(searchParams.get("voiceChatPage")) - 1)
        );
      }
      if (searchParams.get("search")) {
        urlSearchParam.set("search", String(searchParams.get("search")));
        urlSearchParam.set("pagination", String(Number(0)));
      }
      urlSearchParam.set("limit", "10");
      const apiRes = await henceforthApi.SuperAdmin.agentVoiceChatLogs(
        String(params?._id),
        urlSearchParam.toString()
      );
      setVoiceChatLogs({
        data: apiRes?.data?.data,
        count: apiRes?.data?.count,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsVoiceChatLoading(false);
    }
  };
  const initChatLogs = async () => {
    setIsChatLoading(true);
    try {
      let urlSearchParam = new URLSearchParams();

      if (searchParams.get("chatPage")) {
        urlSearchParam.set(
          "pagination",
          String(Number(searchParams.get("chatPage")) - 1)
        );
      }
      if (searchParams.get("search")) {
        urlSearchParam.set("search", String(searchParams.get("search")));
        urlSearchParam.set("pagination", String(Number(0)));
      }
      urlSearchParam.set("limit", "10");
      const apiRes = await henceforthApi.SuperAdmin.agentChatLogs(
        String(params?._id),
        urlSearchParam.toString()
      );
      setChatLogs({
        data: apiRes?.data?.data,
        count: apiRes?.data?.count,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    initChatLogs();
  }, [searchParams.get("chatPage")]);

  useEffect(() => {
    initChatVoiceLogs();
  }, [searchParams.get("voiceChatPage")]);

  const initCallLogs = async () => {
    setIsLoading(true);
    try {
      let urlSearchParam = new URLSearchParams();

      if (searchParams.get("callPage")) {
        urlSearchParam.set(
          "pagination",
          String(Number(searchParams.get("callPage")) - 1)
        );
      } else {
        urlSearchParam.set("pagination", String(0));
      }
      if (searchParams.get("search")) {
        urlSearchParam.set("search", String(searchParams.get("search")));
        urlSearchParam.set("pagination", String(Number(0)));
      }

      if (searchParams.get("limit")) {
        urlSearchParam.set("limit", String(10));
      } else {
        urlSearchParam.set("limit", String(searchParams.get("limit") ?? 10));
      }

      // urlSearchParam.set("agent_id", params?._id as string);

      let apiRes = await henceforthApi.SuperAdmin.agentCallLogs(
        String(params?._id),
        urlSearchParam.toString()
      );
      setCallLogs({
        data: apiRes?.data?.data,
        count: apiRes?.data?.count,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initCallLogs();
  }, [searchParams.get("callPage")]);

  const getAgentDetails = async () => {
    try {
      const apiRes = await henceforthApi.SuperAdmin.getAgent(params?._id);
      setAgentInfo(apiRes?.data);
      console.log(apiRes?.data, "apiRes?.data");
    } catch (error) {
      console.error("Failed to fetch agent details:", error);
    } finally {
      setAgentLoading(false);
    }
  };

  useEffect(() => {
    getAgentDetails();
  }, []);

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

  return (
    <PageContainer>
      <div className="grid grid-cols-1 col-span-1">
        <div>
          {agentLoading ? (
            <AgentCardSkeleton />
          ) : (
            <Card className="w-full p-4 sm:p-6 lg:p-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
                {/* Avatar Section */}
                <div className="flex justify-center sm:justify-start">
                  <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 border-4 border-white shadow-lg">
                    <AvatarImage
                      className="object-cover"
                      src={henceforthApi?.FILES?.imageOriginal(
                        agentInfo?.image
                      )}
                      alt="Agent Avatar"
                    />
                    <AvatarFallback>
                      <User className="w-8 h-8  text-gray-500" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-4 sm:space-y-6">
                  {/* Header Info */}
                  <div className="text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                          {agentInfo?.name}
                        </h1>
                        <div className="space-x-2">
                          <Badge
                            variant="secondary"
                            className="self-center sm:self-auto"
                          >
                            {agentInfo?.type}
                          </Badge>
                          <Badge
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              agentInfo?.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {agentInfo?.status === "ACTIVE"
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant={
                          agentInfo?.status === "ACTIVE"
                            ? "destructive"
                            : "default"
                        }
                        className={
                          "sm:self-start" +
                          ` ${
                            agentInfo?.status === "ACTIVE"
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`
                        }
                        onClick={activateDeactivateAgent}
                      >
                        {agentInfo?.status === "ACTIVE"
                          ? "Deactivate"
                          : "Activate"}{" "}
                        Agent
                      </Button>
                    </div>

                    {/* Agent Details */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <PhoneCall className="text-blue-500 w-4 h-4 mr-1" />
                        {agentInfo?.phone_no ?? "N/A"}
                      </span>
                      <span className="hidden sm:inline text-gray-300">|</span>
                      <span className="flex capitalize items-center">
                        <Cpu className="text-purple-500 w-4 h-4 mr-1" />
                        Model: {agentInfo?.ai_model ?? "GPT-4"}
                      </span>
                      <span className="hidden sm:inline text-gray-300">|</span>
                      <span className="flex items-center">
                        <Mic className="text-green-500 w-4 h-4 mr-1" />
                        Voice: {voiceLabels[agentInfo?.voice] ?? "Natural"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Chat Prompt Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="hidden sm:inline">Chat Prompt</span>
                          <span className="sm:hidden">Chat</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[705px]">
                        <DialogHeader>
                          <DialogTitle>Chat Configuration</DialogTitle>
                          <DialogDescription>
                            First message and prompt settings for chat
                            interactions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">First Message</h4>
                            <p className="text-sm text-gray-600">
                              {agentInfo?.chat_first_message ??
                                "Hello! How can I assist you today?"}
                            </p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Chat Prompt</h4>
                            <p className="text-sm text-gray-600">
                              {agentInfo?.chat_prompt ??
                                "Default chat prompt configuration"}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Call Prompt Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4 text-green-500" />
                          <span className="hidden sm:inline">Call Prompt</span>
                          <span className="sm:hidden">Call</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[705px]">
                        <DialogHeader>
                          <DialogTitle>Call Configuration</DialogTitle>
                          <DialogDescription>
                            First message and prompt settings for call
                            interactions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">First Message</h4>
                            <p className="text-sm text-gray-600">
                              {agentInfo?.call_first_message ??
                                "Hello! Thank you for calling. How may I help you?"}
                            </p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">Call Prompt</h4>
                            <p className="text-sm text-gray-600">
                              {agentInfo?.call_prompt ??
                                "Default call prompt configuration"}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Knowledge Base Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <LibraryBig className="w-4 h-4 text-amber-500" />
                          <span className="hidden sm:inline">
                            Knowledge Bases
                          </span>
                          <span className="sm:hidden">KB</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[705px]">
                        <DialogHeader>
                          <DialogTitle>Knowledge Bases</DialogTitle>
                          <DialogDescription>
                            Knowledge bases assigned to this agent
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          {/* <h4 className="font-medium mb-2">
                              Knowledge Bases
                              </h4> */}

                          {agentInfo?.knowledge_base_id?.length
                            ? agentInfo?.knowledge_base_id?.map(
                                (kb: any, index: number) => (
                                  <div
                                    key={index}
                                    className="border rounded-lg p-4"
                                  >
                                    <div>
                                      <span className="">{kb?.name}</span>
                                      <p className="text-sm text-gray-600">
                                        Created at
                                        {" " +
                                          dayjs(kb?.created_at).format(
                                            "DD MMM YYYY"
                                          )}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )
                            : "No knowledge bases found"}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Edit Button */}
                    <Link
                      href={`/default-agent/${params?._id}/edit`}
                      className="w-full"
                    >
                      <TooltipProvider>
                        <T>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full flex items-center justify-center gap-2 border-green-400 bg-green-100 hover:bg-green-200"
                            >
                              <Pencil className="w-4 h-4 text-green-500" />
                              <span className="hidden sm:inline">
                                Edit Agent
                              </span>
                              <span className="sm:hidden">Edit</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Agent Details</p>
                          </TooltipContent>
                        </T>
                      </TooltipProvider>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )}
          {
            <EmotionDashboard
              agentId={String(params?._id)}
              updateScript={handleScriptDeactivate}
              scriptData={agentInfo?.script_data}
            />
          }
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <PhoneIncoming className="h-5 w-5 mr-2 text-green-600" />
              Telephonic Call Logs
            </CardTitle>

            <CardDescription>
              View all telephonic call logs for this agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={callLogsColumns}
              data={callLogs?.data}
              totalItems={callLogs?.count}
            />
            {callLogs?.data?.length ? (
              <div className="flex justify-center mt-6">
                <PaginationCompo
                  currentPage={Number(searchParams.get("callPage")) || 1}
                  itemsPerPage={Number(searchParams.get("limit")) || 10}
                  totalDataCount={callLogs?.count}
                  onPageChange={handleCallPageChange}
                />
              </div>
            ) : (
              ""
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Podcast className="text-blue-600 h-6 w-6" />
              Conversations
            </CardTitle>

            <CardDescription>View all chat panel conversations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Send className="text-blue-600 h-5 w-5" />
                  Chat Logs
                </CardTitle>

                <CardDescription>
                  View all chat logs for this agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={chatLogsColumns}
                  data={chatLogs?.data}
                  totalItems={chatLogs?.count}
                />
                {chatLogs?.data?.length ? (
                  <div className="flex justify-center mt-6">
                    <PaginationCompo
                      currentPage={Number(searchParams.get("chatPage")) || 1}
                      itemsPerPage={Number(searchParams.get("limit")) || 10}
                      totalDataCount={chatLogs?.count}
                      onPageChange={handleChatPageChange}
                    />
                  </div>
                ) : (
                  ""
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <PhoneIncoming className="text-green-600 h-5 w-5" />
                  Voice Call Logs
                </CardTitle>

                <CardDescription>
                  View all voice call logs for this agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={voiceChatLogsColumns}
                  data={voiceChatLogs?.data}
                  totalItems={voiceChatLogs?.count}
                />
                {voiceChatLogs?.data?.length ? (
                  <div className="flex justify-center mt-6">
                    <PaginationCompo
                      currentPage={
                        Number(searchParams.get("voiceChatPage")) || 1
                      }
                      itemsPerPage={Number(searchParams.get("limit")) || 10}
                      totalDataCount={voiceChatLogs?.count}
                      onPageChange={handleVoiceChatPageChange}
                    />
                  </div>
                ) : (
                  ""
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* <AgentInteractionsView /> */}
    </PageContainer>
  );
};

// export default AgentDashboard;

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <AgentDashboard />
    </DashboardLayout>
  );
}
