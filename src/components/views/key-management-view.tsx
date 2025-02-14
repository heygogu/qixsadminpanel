"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Copy,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Key,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "../common/data-table";
import henceforthApi from "@/utils/henceforthApis";
import { useGlobalContext } from "@/app/providers/Provider";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: "Active" | "Expired";
  usageCount: number;
}

export function KeyManagementView() {
  const [apiKeys, setApiKeys] = useState<any>({
    data: [],
    count: 0,
  });

  const [showFullKey, setShowFullKey] = useState(false);
  const { userInfo, Toast } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const [keyname,setKeyName] = useState("");
  // const {userInfo,Toast}=useGlobalContext();

  const handleDelete = async () => {
    try {
      const apiRes = await henceforthApi.SuperAdmin.deleteKey(
        userInfo?.workspace?._id
      );
      await getWorkspace();
      Toast.success(apiRes?.message);
      return apiRes;
    } catch (error: any) {
      Toast.error(error?.response?.body?.message);
    }
  };

  const [workspace, setWorkspace] = useState<any>();
  const getWorkspace = async () => {
    setIsLoading(true);
    let apiRes;
    try {
      apiRes = await henceforthApi.SuperAdmin.getMyWorkspaces();
      setWorkspace(apiRes?.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
    return apiRes;
  };

  useEffect(() => {
    getWorkspace();
  }, []);

  const router = useRouter();

  return (
    <div className="grid grid-cols-12 min-w-full">
      {isLoading ? (
        <div className="col-span-12 space-y-4">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : !workspace ? (
        <div className="col-span-12">
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <Key className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              No API Key Found
            </h3>
            <p className="mt-2 text-center text-gray-500">
              You haven't generated any API keys yet. Generate one to get
              started with our API.
            </p>
            <Button
              onClick={() => router.push("/settings/key-management/create")}
              className="mt-6 "
            >
              Generate New API Key
            </Button>
          </div>
        </div>
      ) : (
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>Manage your API keys and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Current API Key</h3>
                      <p className="text-sm text-gray-500">
                        Created on{" "}
                        {dayjs(workspace?.created_at).format("MMM D, YYYY")}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 hidden w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={handleDelete}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Key
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <div className="relative flex-1">
                      <Input
                        readOnly
                        type={showFullKey ? "text" : "password"}
                        value={workspace?.secret_key || ""}
                        className="pr-10 font-mono"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowFullKey(!showFullKey)}
                      >
                        {showFullKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          workspace?.secret_key || ""
                        );
                        Toast.success("API key copied to clipboard");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              {/* show workspace id and created_by details below also in a div  like above one(not in a table) */}
              <div className="rounded-md border">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Workspace</h3>
                      <p className="text-sm text-gray-500">
                        Created on{" "}
                        {dayjs(workspace?.created_at).format("MMM D, YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">
                          Creator Name
                        </Label>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {workspace?.created_by?.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium capitalize">
                            {workspace?.created_by?.name}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-500">
                          Creator Email
                        </Label>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              @
                            </span>
                          </div>
                          <span className="font-medium">
                            {workspace?.created_by?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
