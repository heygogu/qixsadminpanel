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
  Cpu,
  Mic,
  LibraryBig,
  Code,
  FileText,
  Copy,
  ChevronUp,
  ChevronDown,
  Code2,
  Pause,
  Play,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "recharts";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { text } from "@/utils/ScriptString";
import CodeBlockDemo from "@/components/common/CodeBlock";

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

  const [scriptLoading, setScriptLoading] = useState(true);

  const [token, setToken] = useState<string | null>(null);
  const [isScriptExpanded, setIsScriptExpanded] = useState(false);
  useEffect(() => {
    if (agentInfo?.script_data?._id) {
      const token = Buffer.from(
        JSON.stringify({
          agent_id: agentInfo?._id,
        })
      )
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      setToken(token);
    }
  }, [agentInfo?.script_data]);

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

  const ScriptLoadingSpinner = () => (
    <div className="flex items-center justify-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  const getAgentDetails = async () => {
    try {
      const apiRes = await henceforthApi.SuperAdmin.getAgent(params?._id);
      setAgentInfo(apiRes?.data);
      console.log(apiRes?.data, "apiRes?.data");
    } catch (error) {
      console.error("Failed to fetch agent details:", error);
    } finally {
      setAgentLoading(false);
      setScriptLoading(false);
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
                      {/* <Button
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
                      </Button> */}
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
                      href={`/ai-agents/edit/agent-template/${params?._id}`}
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
          <div className="grid grid-cols-1">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">
                  Script Details
                </CardTitle>
                <Code2 className="h-6 w-6 text-purple-500" />
              </CardHeader>
              <CardContent className="space-y-5 rounded-lg m-4 mt-6  bg-gradient-to-br from-violet-300 to-purple-100 backdrop-blur-sm shadow-lg border border-white/20 p-4 sm:p-2 md:p-3 lg:p-5 xl:p-8 hover:shadow-xl transition-all duration-300">
                {/* Add your script details content here */}
                {scriptLoading ? (
                  <ScriptLoadingSpinner />
                ) : //check if scriptData object is empty

                !agentInfo?.script_data ||
                  Object.keys(agentInfo?.script_data).length === 0 ? (
                  //create a ui to show that script is not available and you can create one , create an outstanding message to show that script is not available
                  <div className="flex flex-col items-center justify-center  ">
                    <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 opacity-75 blur"></div>
                    <div className="relative bg-transparent rounded-lg  ">
                      <div className="flex flex-col items-center space-y-2 py-3">
                        <div className=" bg-purple-100 p-2 rounded-full animate-pulse">
                          <Code2 className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          No Script Found
                        </h3>
                        <p className="text-gray-600 text-center text-sm max-w-sm leading-relaxed">
                          Enhance your AI agent's capabilities by creating a
                          custom script. Monitor emotions and interactions in
                          real-time.
                        </p>
                        <Link
                          href={`/ai-agents/${agentInfo?._id}/script/create`}
                        >
                          <Button className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-300"></span>
                            <Code className="w-4 h-4 mr-2" />
                            Create New Script
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      {/* Header Section */}
                      <div className="flex justify-between items-center bg-white/40 backdrop-blur-sm rounded-lg p-3">
                        <motion.div
                          className="flex items-center space-x-3"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="p-2 bg-purple-100 rounded-full">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex flex-col">
                            <TooltipProvider>
                              <T>
                                <TooltipTrigger>
                                  <span className="text-sm font-medium text-gray-700">
                                    {`${agentInfo?.script_data?._id?.slice(
                                      0,
                                      4
                                    )}...${agentInfo?.script_data?._id?.slice(
                                      -4
                                    )}`}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <span className="text-xs">
                                    {agentInfo?.script_data?._id}
                                  </span>
                                </TooltipContent>
                              </T>
                            </TooltipProvider>
                            <span className="text-xs text-gray-500">
                              {dayjs(agentInfo?.script_data?.created_at).format(
                                "DD MMM YYYY"
                              )}
                            </span>
                          </div>
                          <Badge
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              agentInfo?.script_data?.script_status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {agentInfo?.script_data?.script_status === "ACTIVE"
                              ? "Active"
                              : "Inactive"}
                          </Badge>
                        </motion.div>

                        <div className="flex items-center space-x-2"></div>
                        <TooltipProvider>
                          <T>
                            <TooltipTrigger>
                              <Button
                                size={"sm"}
                                onClick={handleScriptDeactivate}
                                className={
                                  "rounded-full " +
                                    agentInfo?.script_data?.script_status ===
                                  "ACTIVE"
                                    ? "bg-green-500 text-white"
                                    : "bg-yellow-500 text-white"
                                }
                              >
                                {agentInfo?.script_data?.script_status ===
                                "ACTIVE" ? (
                                  <Pause className="w-4 h-4 " />
                                ) : (
                                  <Play className="w-4 h-4 " />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span className="text-xs">
                                Toggle Script Status
                              </span>
                            </TooltipContent>
                          </T>
                        </TooltipProvider>
                      </div>

                      {/* Actions Section */}
                      <div className="grid grid-cols-2 gap-3">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href={`${process.env.NEXT_PUBLIC_DEV_CHAT_LINK}/form?token=${token}`}
                            className="flex items-center justify-center space-x-2 bg-white/50 backdrop-blur-sm p-3 rounded-lg hover:bg-white/60 transition-all"
                            target="_blank"
                          >
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">
                              View Page
                            </span>
                          </Link>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href={`/ai-agents/${agentInfo?._id}/script/edit`}
                            className="flex items-center justify-center space-x-2 bg-white/50 backdrop-blur-sm p-3 rounded-lg hover:bg-white/60 transition-all"
                          >
                            <Code className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-700">
                              Edit Script
                            </span>
                          </Link>
                        </motion.div>
                      </div>

                      {/* Script Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-all"
                          >
                            <FileText className="h-4 w-4" />
                            <span>View Full Script</span>
                          </motion.button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[725px]">
                          <DialogHeader>
                            <DialogTitle>Chatbot Script</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <div className="flex flex-col gap-2 mb-4">
                              <Label>CDN Links</Label>
                              <p className="text-sm text-gray-600">
                                Embed these in the body/head of your project's
                                HTML:
                              </p>
                              <div className="flex items-center w-full">
                                {/* <Input
                                  className="flex-1"
                                  value={`<script src="${process.env.NEXT_PUBLIC_DEV_BOT_CDN_LINK}?token=${token}"></script>`}
                                  readOnly
                                />
                                <Button
                                  className="ml-2"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `<script src="${process.env.NEXT_PUBLIC_DEV_BOT_CDN_LINK}?token=${token}"></script>`
                                    );
                                    Toast.success("Chatbot script copied");
                                  }}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button> */}
                                <CodeBlockDemo
                                  code={`<script src="https://cdn.jsdelivr.net/npm/@deepgram/sdk"></script><script src="${process.env.NEXT_PUBLIC_DEV_BOT_CDN_LINK}?token=${token}"></script>`}
                                />
                              </div>
                            </div>
                            <div className=" max-w-3xl mt-5 flex flex-col gap-2 overflow-y-auto">
                              <div className="flex items-center justify-between">
                                <Label>Chatbot Script</Label>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    setIsScriptExpanded(!isScriptExpanded)
                                  }
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
                            {/* <Button
              className={!isScriptExpanded ? "mt-5" : ""}
              variant="outline"
              onClick={() => setIsScriptModalOpen(false)}
            >
              Close
            </Button> */}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
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
