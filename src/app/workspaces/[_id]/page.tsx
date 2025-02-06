"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";

import {
  Building2,
  Users,
  CreditCard,
  Lock,
  Eye,
  User,
  Shield,
  Crown,
} from "lucide-react";
import PageContainer from "@/components/layouts/page-container";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import henceforthApi from "@/utils/henceforthApis";
import { useParams, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Column definitions for subscriptions

const WorkspaceDetailsSkeleton = () => (
  <Card>
    <CardContent className="pt-4">
      <div className="grid md:grid-cols-2 gap-4 p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface IWorkspaceDetails {
  _id: string;
  name: string;
  image: string;
  status: string;
  created_at: number;
  updated_at: number;
  owner_data: {
    _id: string;
    name: string;
    profile_pic: string | null;
  };
  workspace_members_count: number;
  subscription_data: any[];
}
const WorkspaceModule = () => {
  const [workSpaceMembers, setWorkspaceMembers] = useState({
    data: [],
    count: 0,
    loading: false,
  });

  const [subscriptionData, setSubscriptionData] = useState({
    data: [],
    count: 0,
    loading: false,
  });
  console.log(subscriptionData, "subscriptionData");
  const [workspaceDetails, setWorkSpaceDetails] = useState<IWorkspaceDetails>({
    _id: "",
    name: "",
    image: "",
    status: "",
    created_at: 0,
    updated_at: 0,
    owner_data: {
      _id: "",
      name: "",
      profile_pic: "",
    },
    workspace_members_count: 0,
    subscription_data: [],
  });
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const params = useParams();

  //columns
  const subscriptionColumns = [
    {
      accessorKey: "srNo",
      header: "Sr No",
      cell: ({ row }) => {
        const currentPage = Number(searchParams.get("subscriptionPage") || 1);
        const index = (currentPage - 1) * 10 + row.index + 1;
        return index;
      },
    },
    {
      accessorKey: "plan_name",
      header: "Subscription Name",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `₹${row.original.amount}`,
    },
    {
      accessorKey: "created_on",
      header: "Date",
      cell: ({ row }) => dayjs(row.original.created_on).format("DD MMM YYYY"),
    },
  ];

  // Column definitions for members
  const memberColumns = [
    {
      accessorKey: "srNo",
      header: "Sr No",
      cell: ({ row }) => {
        const currentPage = Number(searchParams.get("memberPage") || 1);
        const index = (currentPage - 1) * 10 + row.index + 1;
        return index;
      },
    },
    {
      // accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 shadow-md border-2 border-white">
            <AvatarImage
              className="object-cover"
              src={henceforthApi.FILES.imageOriginal(
                row.original?.vendor_id?.profile_pic,
                ""
              )}
              alt={row.original?.vendor_id?.name}
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.original?.vendor_id?.name}</span>
            <span className="text-gray-500">{row?.original?.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span
          className={`flex items-center gap-2 w-24 ${
            row.original.role === "OWNER"
              ? " text-yellow-600"
              : row.original.role === "ADMIN"
              ? "b text-blue-800"
              : " text-gray-800"
          }`}
        >
          {row.original.role === "OWNER" ? (
            <Crown className="text-yellow-500" />
          ) : (
            <Shield className="text-blue-500" />
          )}{" "}
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "ACTIVE" ? "default" : "destructive"}
          className={`shadow-md ${
            row.original.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.original.status === "ACTIVE"
            ? "Active"
            : row.original.status === "IN_ACTIVE"
            ? "Inactive"
            : "Unknown"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/vendors/${row.original.vendor_id?._id}/view`} passHref>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  const fetchWorkspaceMembers = async () => {
    setWorkspaceMembers((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      let urlSearchParams = new URLSearchParams();
      if (searchParams.get("memberPage")) {
        urlSearchParams.set(
          "pagination",
          String(Number(searchParams?.get("memberPage") || 1) - 1)
        );
      }
      urlSearchParams.set("limit", "10");
      const apiRes = await henceforthApi.SuperAdmin.getWorkspaceMembersListing(
        String(params?._id),
        urlSearchParams.toString()
      );
      setWorkspaceMembers((prev) => ({
        ...prev,
        data: apiRes?.data?.data,
        count: apiRes?.data?.count,
      }));
    } catch (error) {
    } finally {
      setWorkspaceMembers((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const fetchSubscriptionData = async () => {
    setSubscriptionData((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      let urlSearchParams = new URLSearchParams();
      if (searchParams.get("subscriptionPage")) {
        urlSearchParams.set(
          "pagination",
          String(Number(searchParams?.get("subscriptionPage") || 1) - 1)
        );
      }
      urlSearchParams.set("limit", "10");
      const apiRes =
        await henceforthApi.SuperAdmin.getWorkspaceSubscriptionListing(
          String(params?._id),
          urlSearchParams.toString()
        );
      console.log(apiRes, "subscriptionapiRes");
      setSubscriptionData((prev) => ({
        ...prev,
        data: apiRes?.data?.data,
        count: apiRes?.data?.count,
      }));
    } catch (error) {
    } finally {
      setSubscriptionData((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const getWorkSpaceDetails = async () => {
    setLoading(true);
    try {
      const apiRes = await henceforthApi.SuperAdmin.workspaceDetails(
        String(params?._id)
      );
      setWorkSpaceDetails(apiRes?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkSpaceDetails();
  }, []);
  useEffect(() => {
    fetchWorkspaceMembers();
  }, [searchParams.get("memberPage")]);

  useEffect(() => {
    fetchSubscriptionData();
  }, [searchParams.get("subscriptionPage")]);

  const memberSkeletonColumns = memberColumns.map((column: any) => ({
    ...column,
    cell: () => <Skeleton className="h-5 p-3 bg-gray-200 w-full" />,
  }));
  const subscriptionSkeletonColumns = subscriptionColumns.map(
    (column: any) => ({
      ...column,
      cell: () => <Skeleton className="h-5 p-3 bg-gray-200 w-full" />,
    })
  );

  return (
    <PageContainer>
      <div className="grid grid-cols-1 col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Workspace Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {loading ? (
              <WorkspaceDetailsSkeleton />
            ) : (
              <Card>
                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-2 gap-4  p-3 ">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                          <AvatarImage
                            src={henceforthApi.FILES.imageOriginal(
                              workspaceDetails?.image
                            )}
                            alt="Workspace"
                          />
                          <AvatarFallback>
                            <Building2 className="h-8 w-8" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {workspaceDetails?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {dayjs(workspaceDetails?.created_at).format(
                              "DD MMM YYYY"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Active</Badge>
                        <span className="text-sm text-gray-500">
                          {workspaceDetails?.workspace_members_count}{" "}
                          {workspaceDetails?.workspace_members_count < 2
                            ? "member"
                            : "members"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span>$299/month</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                {subscriptionData.loading ? (
                  <DataTable
                    columns={subscriptionSkeletonColumns}
                    data={Array.from({ length: 8 }, (_, index) => ({ index }))}
                    totalItems={8}
                  />
                ) : (
                  <DataTable
                    columns={subscriptionColumns}
                    data={subscriptionData?.data}
                    totalItems={10}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workspace Members</CardTitle>
              </CardHeader>
              <CardContent>
                {workSpaceMembers.loading ? (
                  <DataTable
                    columns={memberSkeletonColumns}
                    data={Array.from({ length: 8 }, (_, index) => ({ index }))}
                    totalItems={8}
                  />
                ) : (
                  <DataTable
                    columns={memberColumns}
                    data={workSpaceMembers?.data}
                    totalItems={10}
                  />
                )}
              </CardContent>
            </Card>
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
