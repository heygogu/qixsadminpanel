"use client";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  CreditCard,
  Lock,
  Eye,
  Image as ImageIcon,
  User,
  Building,
  LockOpen,
} from "lucide-react";
import PageContainer from "@/components/layouts/page-container";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import Link from "next/link";
import henceforthApi from "@/app/utils/henceforthApis";
import { useParams, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalContext } from "@/app/providers/Provider";

// Column definitions for workspace listing

const WorkspaceModule = () => {
  const [workspaceData, setWorkspaceData] = React.useState({
    data: [],
    count: 0,
    loading: false,
  });

  const params = useParams();
  const searchParams = useSearchParams();
  const { Toast } = useGlobalContext();

  async function fetchData() {
    setWorkspaceData({
      ...workspaceData,
      loading: true,
    });
    try {
      const urlSearchParams = new URLSearchParams();
      if (params?.pagination) {
        urlSearchParams.set(
          "pagination",
          String(Number(params?.pagination || 1) - 1)
        );
      }
      urlSearchParams.set("limit", "10");
      const res = await henceforthApi.SuperAdmin.workspaceListing(
        urlSearchParams.toString()
      );

      setWorkspaceData({
        data: res?.data?.data,
        count: res?.data?.count,
        loading: false,
      });
    } catch (error) {}
  }
  const handleWorkspaceStatus = async (id, status) => {
    let convertedStatus = status === "BLOCK" ? "UNBLOCK" : "BLOCK";
    try {
      const apiRes = await henceforthApi.SuperAdmin.toggleWorkspaceStatus(
        id,
        convertedStatus
      );
      await fetchData();
      Toast.success(
        `Workspace ${convertedStatus?.toLocaleLowerCase()}ed successfully `
      );
    } catch (error) {
      Toast.error(error);
    }
  };

  const workspaceColumns = [
    {
      id: "index",
      header: ({ column }) => {
        return <span className="w-5 ml-1">Sr. No.</span>;
      },
      cell: ({ row }) => {
        const currentPage = Number(useParams().pagination) - 1;
        const itemsPerPage = 10;
        const index = currentPage * itemsPerPage + row.index + 1;
        return <span className="w-5 pl-3">{index}</span>;
      },
    },
    {
      accessorKey: "name",
      header: "Workspace",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 shadow-md border-2 border-white">
            <AvatarImage src={row.original.image} alt={row.original.name} />
            <AvatarFallback>
              <Building2 className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span>{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "owner_data",
      header: "Owner",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 shadow-md border-2 border-white">
            <AvatarImage
              src={henceforthApi.FILES.imageOriginal(
                row.original.owner_data?.profile_pic
              )}
              alt={row.original?.owner_data?.name}
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span>{row.original?.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "workspace_members_count",
      header: "Members",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span>{row.original.workspace_members_count}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "UNBLOCK" ? "default" : "destructive"
          }
          className={`shadow-md ${
            row.original.status === "UNBLOCK"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.original.status === "UNBLOCK"
            ? "Active"
            : row.original.status === "BLOCK"
            ? "Inactive"
            : "Unknown"}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-gray-500" />$
          {row.original.amount ?? 100}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link
            href={`/workspaces/${row.original._id}?memberPage=1&subscriptionPage=1`}
          >
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleWorkspaceStatus(row?.original?._id, row?.original?.status)
            }
          >
            {row.original?.status === "UNBLOCK" ? (
              <Tooltip>
                <TooltipTrigger>
                  <Lock className="h-full w-full text-red-500" />
                </TooltipTrigger>
                <TooltipContent>Block</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <LockOpen className="h-full w-full text-green-500" />
                </TooltipTrigger>
                <TooltipContent>Unblock</TooltipContent>
              </Tooltip>
            )}
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);
  const skeletonColumns = workspaceColumns.map((column: any) => ({
    ...column,
    cell: () => <Skeleton className="h-6 bg-gray-200 w-full" />,
  }));

  return (
    <PageContainer>
      <div className="grid grid-cols-1 col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Workspaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workspaceData.loading ? (
              <div className="mx-auto">
                <DataTable
                  columns={skeletonColumns}
                  data={Array.from({ length: 8 }, (_, index) => ({ index }))}
                  totalItems={8}
                />
              </div>
            ) : (
              <DataTable
                columns={workspaceColumns}
                data={workspaceData.data}
                totalItems={workspaceData.count}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <WorkspaceModule />
    </DashboardLayout>
  );
}
