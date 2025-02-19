"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Phone,
  Users,
  DollarSign,
  CreditCard,
  Wallet,
  Brain,
  Mic,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  IndianRupee,
  User,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DataTable } from "@/components/common/data-table";
import PageContainer from "@/components/layouts/page-container";
import DashboardLayout from "@/components/layouts/dashboard-layout";

import henceforthApi from "@/utils/henceforthApis";

import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Dashboard = () => {
  const [period, setPeriod] = useState("TODAY");
  const [stats, setStats] = useState({
    total_call: 0,
    total_chat: 0,
    voice_chat: 0,
    total_vendor: 0,
    total_earning: "N/A",
    total_subscription: 0,
    total_payments: 0,
    gpt_spendings: "N/A",
    deepgram_spendings: "N/A",
  });

  const [vendorData, setVendorData] = useState({
    data: [],
    count: 0,
    loading: true,
  });

  const [subscriptionData, setSubscriptionData] = useState({
    data: [],
    count: 0,
  });
  console.log(stats, "jhgyusfdgcwefiu");
  const fetchStats = async () => {
    try {
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.set("type", period);
      const apiRes = await henceforthApi.SuperAdmin.getDashboardStats(
        urlSearchParams.toString()
      );
      const Stats = apiRes?.data;
      setStats((prev) => ({
        ...prev,
        total_call: Stats?.total_call,
        total_chat: Stats?.total_chat,
        voice_chat: Stats?.voice_chat,
        total_vendor: Stats?.total_vendor,
        total_earning: "N/A",
        total_subscription: Stats?.total_subscription,
        total_payments: Stats?.total_payments,
        gpt_spendings: "N/A",
        deepgram_spendings: "N/A",
      }));
    } catch (error) {}
  };
  useEffect(() => {
    fetchStats();
  }, [period]);

  const getVendorListing = async () => {
    try {
      setVendorData((prev) => ({ ...prev, loading: true }));
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.set("limit", "10");
      const apiRes = await henceforthApi.SuperAdmin.getDashboardVendorListing(
        urlSearchParams.toString()
      );
      console.log(apiRes, "apiRes");
      if (apiRes?.data?.data) {
        setVendorData((prev) => ({
          ...prev,
          data: apiRes.data.data,
          count: apiRes.data.count,
          loading: false,
        }));
      }
      console.log(apiRes, "apiRes");
    } catch (error) {
      console.log(error, "error");
      setVendorData((prev) => ({ ...prev, loading: false }));
    }
  };

  const getSubscriptionListing = async () => {
    try {
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.set("limit", "10");
      const apiRes = await henceforthApi.SuperAdmin.getSubscriptionListing(
        urlSearchParams.toString()
      );

      setSubscriptionData((prev) => ({
        ...prev,
        data: apiRes?.data?.data,
        count: apiRes?.data?.count,
      }));
      // console.log(apiRes, "apiRes");
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    getVendorListing();
    getSubscriptionListing();
  }, []);
  // Mock data for tables
  const subscriptionColumns = [
    {
      header: "Vendor",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-white shadow-md">
            <AvatarImage
              className="object-cover"
              src={henceforthApi.FILES?.imageOriginal(
                row.original?.vendor?.profile_pic,
                ""
              )}
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original?.vendor?.name}</span>
        </div>
      ),
    },
    {
      header: "Plan",
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className="bg-gray-200 capitalize shadow-md text-gray-800"
        >
          {row.original?.plan_name ?? "N/A"}
        </Badge>
      ),
    },
    {
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          ₹{row.original?.amount?.toFixed(2) ?? 0}
        </div>
      ),
    },
    {
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {dayjs(row.original?.created_at).format("DD MMM YYYY")}
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original?.status === "authenticated" ? "default" : "destructive"
          }
          className={`shadow-md ${
            row.original?.status === "authenticated"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.original?.status === "authenticated" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: () => (
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Eye className="h-4 w-4 text-gray-600" />
        </button>
      ),
    },
  ];

  const vendorColumns = [
    {
      header: "Vendor",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-white shadow-md">
            <AvatarImage
              className="object-cover"
              src={henceforthApi.FILES?.imageOriginal(
                row.original?.profile_pic,
                ""
              )}
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original?.name}</span>
        </div>
      ),
    },
    {
      header: "Workspace",
      accessorKey: "workspace",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 w-[200px]">
          {row.original.workspace?.slice(0, 3)?.map((workspace) => (
            <Badge
              key={workspace.name}
              variant="secondary"
              className="bg-gray-200 shadow-md capitalize text-gray-800"
            >
              {workspace.name}
            </Badge>
          ))}
          {row.original.workspace?.length > 3 && (
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 capitalize text-gray-800 cursor-pointer"
                >
                  +{row.original.workspace.length - 3}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  {row.original.workspace?.map((workspace) => (
                    <Badge
                      key={workspace.name}
                      variant="secondary"
                      className="bg-gray-100 capitalize text-gray-800"
                    >
                      {workspace.name}
                    </Badge>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      ),
    },

    {
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
            : row.original.status === "BLOCK"
            ? "Blocked"
            : "Unknown"}
        </Badge>
      ),
    },
    {
      header: "Created at",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {dayjs(row.original?.created_at).format("DD MMM YYYY")}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/vendors/${row.original._id}/view`} passHref>
          <Button variant={"ghost"}>
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="grid grid-cols">
        {/* Overview Section */}
        <div className="mb-8 col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Overview</h2>
            <Select
              defaultValue="TODAY"
              onValueChange={(value) => setPeriod(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODAY">Today</SelectItem>
                <SelectItem value="WEEK">This Week</SelectItem>
                <SelectItem value="MONTH">This Month</SelectItem>
                <SelectItem value="YEAR">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Chats"
              value={stats?.total_chat}
              icon={<MessageSquare className="h-4 w-4" />}
              trend={8.2}
              trendUp={true}
              // description="vs. last period"
            />
            <StatsCard
              title="Total Calls"
              value={stats?.total_call}
              icon={<Phone className="h-4 w-4" />}
              trend={5.1}
              trendUp={true}
              // description="vs. last period"
            />
            <StatsCard
              title="Total Vendors"
              value={stats?.total_vendor}
              icon={<Users className="h-4 w-4" />}
              trend={2.3}
              trendUp={false}
              // description="vs. last period"
            />
            <StatsCard
              title="Total Earnings"
              // value={`₹${stats?.total_earning?.toFixed(2)}`}
              value="N/A"
              icon={<IndianRupee className="h-4 w-4" />}
              trend={12.5}
              trendUp={true}
              // description="vs. last period"
            />
          </div>
        </div>

        {/* Financial Overview Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold  mb-6">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Subscriptions"
              value={stats?.total_subscription}
              icon={<CreditCard className="h-4 w-4" />}
              trend={4.5}
              trendUp={true}
              // description={`${stats?.total_subscription} last ${
              //   period === "TODAY" ? "day" : period?.toLowerCase()
              // }`}
            />
            <StatsCard
              title="Total Payments"
              value={`₹${stats?.total_payments?.toFixed(2)}`}
              icon={<Wallet className="h-4 w-4" />}
              trend={6.8}
              trendUp={true}
              // description={`₹${stats?.total_payments?.toFixed(2)} last  last ${
              //   period === "TODAY" ? "day" : period?.toLowerCase()
              // }`}
            />
            <StatsCard
              title="GPT Spendings"
              // value={`₹${stats?.gpt_spendings?.toFixed(2)}`}
              value="N/A"
              icon={<Brain className="h-4 w-4" />}
              trend={2.1}
              trendUp={false}
              // description={`₹${stats?.gpt_spendings?.toFixed(2)} last ${
              //   period === "TODAY" ? "day" : period?.toLowerCase()
              // }`}
            />
            <StatsCard
              title="Deepgram Spendings"
              // value={`₹${stats?.deepgram_spendings?.toFixed(2)}`}
              value="N/A"
              icon={<Mic className="h-4 w-4" />}
              trend={3.4}
              trendUp={true}
              // description={`₹${stats?.deepgram_spendings?.toFixed(
              //   2
              // )} last  last ${
              //   period === "TODAY" ? "day" : period?.toLowerCase()
              // }`}
            />
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={subscriptionColumns}
                data={subscriptionData?.data}
                totalItems={10}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={vendorColumns}
                data={vendorData?.data}
                totalItems={10}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, trend, trendUp }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-secondary rounded-lg">{icon}</div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trendUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {trendUp ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {trend}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {/* {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )} */}
      </div>
    </CardContent>
  </Card>
);

// Mock data generators
const generateSubscriptionData = () => {
  const vendors = [
    {
      name: "Tech Corp",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=TC",
    },
    {
      name: "Digital Solutions",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=DS",
    },
    {
      name: "Smart Systems",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=SS",
    },
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: vendors[i % vendors.length].name,
    image: vendors[i % vendors.length].image,
    amount: Math.floor(Math.random() * 1000) + 100,
    date: new Date(
      Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
  }));
};

const generateVendorData = () => {
  const vendors = [
    {
      name: "Cloud Services",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=CS",
    },
    {
      name: "AI Solutions",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=AS",
    },
    {
      name: "Data Corp",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=DC",
    },
  ];

  const statuses = ["Active", "Pending", "Inactive"];
  const workspaces = ["Development", "Production", "Testing"];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: vendors[i % vendors.length].name,
    image: vendors[i % vendors.length].image,
    workspace: workspaces[i % workspaces.length],
    status: statuses[i % statuses.length],
    date: new Date(
      Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
  }));
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}
