"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  EarthLock,
  MessageSquare,
  Settings,
  Settings2,
  Share,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import henceforthApi from "@/utils/henceforthApis";
import { useParams } from "next/navigation";

interface WebpagePreviewProps {
  settings: {
    title: string;
    description: string;
    primaryColor: string;
    accentColor: string;
  };
  isImageLoading: boolean;
}

export function WebpagePreview({
  settings,
  isImageLoading,
}: WebpagePreviewProps) {
  console.log(settings);

  const [agentDetails, setAgentDetails] = useState<any>();
  const params = useParams();

  useEffect(() => {
    async function getAgentDetails() {
      try {
        const apiRes = await henceforthApi.SuperAdmin.getAgent(params?._id);
        setAgentDetails(apiRes.data);
      } catch (error) {}
    }

    if (params?._id) {
      getAgentDetails();
    }
  }, [params?._id]);
  const messages = [
    {
      isBot: true,
      content: "Hello! I am an ai assistance from henceforth solution.",
    },
    {
      isBot: false,
      content: "hey",
    },
    {
      isBot: true,
      content: "Hey there! 😊",
    },
    {
      isBot: false,
      content: "how are you",
    },
    {
      isBot: true,
      content: "I'm great, thanks for asking. 😊",
    },
  ];

  return (
    <Card className="w-full max-w-3xl rounded-sm shadow-lg mx-auto overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div
          className=" pt-5  flex flex-col"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div className="mb-6 flex  flex-col items-center">
            {agentDetails?.image && !isImageLoading ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                src={henceforthApi.FILES.imageOriginal(agentDetails?.image, "")}
                alt="Logo"
                className="w-16 object-cover rounded-full h-16"
              />
            ) : (
              <div className="w-16 h-16  bg-green-600 rounded-full flex items-center justify-center">
                <div className="text-white font-bold">HS</div>
              </div>
            )}
            <div
              style={{ color: settings?.accentColor }}
              className="max-w-[100px] text-wrap text-break"
            >
              <h2 className="text-md font-bold mt-2 text-center">
                {settings?.title}
              </h2>
              <p className="text-sm text-center">{settings?.description}</p>
            </div>
          </div>

          <div
            style={{ color: settings?.accentColor }}
            className="space-y-2 p-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <EarthLock size={16} />
              Privacy Policy
            </div>
            <div className="flex items-center gap-2">
              <Settings size={16} />
              Terms & Conditions
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div
            className=" m-2 mt-1 rounded-lg p-3 flex justify-center items-center"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <h3 className="text-md text-white font-semibold">AI Agent</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                {message.isBot && (
                  <div className="w-6 h-6  rounded-full flex items-center justify-center mr-2">
                    {agentDetails?.image && !isImageLoading ? (
                      <img
                        className="rounded-full object-cover h-5 w-5"
                        src={henceforthApi.FILES.imageOriginal(
                          agentDetails.image,
                          ""
                        )}
                      ></img>
                    ) : (
                      <span className="text-white rounded-full p-2 bg-green-600 text-xs">
                        HS
                      </span>
                    )}
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] text-xs ${
                    message.isBot ? "bg-gray-100" : " text-white"
                  }`}
                  style={
                    !message.isBot
                      ? { backgroundColor: settings.primaryColor }
                      : { backgroundColor: "#f0f0f0" }
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button size="icon">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default WebpagePreview;
