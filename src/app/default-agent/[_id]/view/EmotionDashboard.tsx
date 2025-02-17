"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Phone,
  MessageCircle,
  Activity,
  MessageSquare,
  FileText,
  Calendar,
  Copy,
  ChevronUp,
  ChevronDown,
  Code,
  Code2,
  Edit,
  Pause,
  Play,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import henceforthApi from "@/utils/henceforthApis";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as T,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { useGlobalContext } from "@/app/providers/Provider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { text } from "@/utils/ScriptString";

// Types
type EmotionData = {
  positive: number;
  negative: number;
  neutral: number;
};

type PieChartData = {
  name: "Positive" | "Negative" | "Neutral";
  value: number;
};

type ChartColors = {
  [key: string]: string;
};

type ChartState = {
  pieData: PieChartData[];
};

const COLORS = {
  success: "#10B981",
  disrupted: "#F59E0B",
  unsuccessful: "#EF4444",
} as const;
interface EmotionDashboardProps {
  agentId: string;
  scriptData: any;
  updateScript: any;
}

const EmotionDashboard = React.memo(
  ({ agentId, scriptData, updateScript }: EmotionDashboardProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { userInfo, Toast } = useGlobalContext();
    const [scriptLoading, setScriptLoading] = useState(true);

    const [token, setToken] = useState<string | null>(null);
    const [isScriptExpanded, setIsScriptExpanded] = useState(false);
    useEffect(() => {
      if (scriptData?._id) {
        const token = Buffer.from(
          JSON.stringify({
            agent_id: agentId,
            secret_key: scriptData?.key,

            workspace_id: userInfo?.workspace?._id,
          })
        )
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        setToken(token);
      }
    }, [scriptData]);

    const [chatChartData, setChatChartData] = useState<ChartState>({
      pieData: [
        { name: "Positive", value: 0 },
        { name: "Negative", value: 0 },
        { name: "Neutral", value: 0 },
      ],
    });

    const [callChartData, setCallChartData] = useState<ChartState>({
      pieData: [
        { name: "Positive", value: 0 },
        { name: "Negative", value: 0 },
        { name: "Neutral", value: 0 },
      ],
    });

    // Convert API data to chart format
    const transformEmotionData = (data: EmotionData): PieChartData[] => {
      return [
        { name: "Positive", value: data.positive || 0 },
        { name: "Negative", value: data.negative || 0 },
        { name: "Neutral", value: data.neutral || 0 },
      ];
    };

    const renderPieChart = (data: PieChartData[], colors: ChartColors) => {
      // Check if all values are 0
      const hasData = data.some((item) => item.value > 0);

      if (!hasData) {
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        );
      }

      return (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[entry.name] || COLORS.success}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "white",

                borderRadius: "6px",
                padding: "4px",
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => value}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    };

    useEffect(() => {
      let timeout: NodeJS.Timeout;
      timeout = setTimeout(() => {
        setScriptLoading(false);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }, []);
    useEffect(() => {
      const fetchData = async () => {
        if (!agentId) return;

        try {
          setLoading(true);
          setError(null);

          const apiRes = await henceforthApi.SuperAdmin.agentPieChartData(
            agentId
          );

          if (apiRes?.data) {
            // Update chat data
            if (apiRes.data.chat_emotion) {
              setChatChartData({
                pieData: transformEmotionData(apiRes.data.chat_emotion),
              });
            }

            // Update call data
            if (apiRes.data.voice_call_emotion) {
              setCallChartData({
                pieData: transformEmotionData(apiRes.data.voice_call_emotion),
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch agent pie chart data:", error);
          setError("Failed to load chart data");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [agentId]);

    const LoadingSpinner = () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );

    const ScriptLoadingSpinner = () => (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
    const ErrorDisplay = () => (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );

    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calls Section */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">
              Call Emotions
            </CardTitle>
            <Phone className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorDisplay />
            ) : (
              renderPieChart(callChartData.pieData, {
                Positive: COLORS.success,
                Neutral: COLORS.disrupted,
                Negative: COLORS.unsuccessful,
              })
            )}
          </CardContent>
        </Card>

        {/* Chats Section */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-semibold">
              Chat Emotions
            </CardTitle>
            <MessageCircle className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorDisplay />
            ) : (
              renderPieChart(chatChartData.pieData, {
                Positive: COLORS.success,
                Neutral: COLORS.disrupted,
                Negative: COLORS.unsuccessful,
              })
            )}
          </CardContent>
        </Card>

        {/* Script Details Section */}
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

            !scriptData || Object.keys(scriptData).length === 0 ? (
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
                      Enhance your AI agent's capabilities by creating a custom
                      script. Monitor emotions and interactions in real-time.
                    </p>
                    <Link href={`/default-agent/${agentId}/script/create`}>
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
                                {`${scriptData?._id?.slice(
                                  0,
                                  4
                                )}...${scriptData?._id?.slice(-4)}`}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span className="text-xs">{scriptData?._id}</span>
                            </TooltipContent>
                          </T>
                        </TooltipProvider>
                        <span className="text-xs text-gray-500">
                          {dayjs(scriptData?.created_at).format("DD MMM YYYY")}
                        </span>
                      </div>
                      <Badge
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          scriptData?.script_status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {scriptData?.script_status === "ACTIVE"
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
                            onClick={updateScript}
                            className={
                              "rounded-full " + scriptData?.script_status ===
                              "ACTIVE"
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 text-white"
                            }
                          >
                            {scriptData?.script_status === "ACTIVE" ? (
                              <Pause className="w-4 h-4 " />
                            ) : (
                              <Play className="w-4 h-4 " />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span className="text-xs">Toggle Script Status</span>
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
                        href={`${process.env.NEXT_PUBLIC_PROD_CHAT_LINK}/form?token=${token}`}
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
                        href={`/default-agent/${agentId}/script/edit`}
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
                          <Label>CDN Link</Label>
                          <p className="text-sm text-gray-600">
                            Embed this in the body of your project's HTML:
                          </p>
                          <div className="flex items-center w-full">
                            <Input
                              className="flex-1"
                              value={`<script src="${process.env.NEXT_PUBLIC_PROD_BOT_CDN_LINK}?token=${token}"></script>`}
                              readOnly
                            />
                            <Button
                              className="ml-2"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `<script src="${process.env.NEXT_PUBLIC_PROD_BOT_CDN_LINK}?token=${token}"></script>`
                                );
                                Toast.success("Chatbot script copied");
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
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
    );
  }
);

export default EmotionDashboard;
