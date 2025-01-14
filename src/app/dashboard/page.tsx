"use client";
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Eye
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DataTable } from '@/components/common/data-table';
import PageContainer from '@/components/layouts/page-container';
import DashboardLayout from '@/components/layouts/dashboard-layout';

const Dashboard = () => {
  // Mock data for widgets
  const stats = {
    today: {
      totalChats: 145,
      totalCalls: 67,
      totalVendors: 12,
      totalEarnings: 2345.00,
      trend: 'up'
    }
  };

  const financialStats = {
    totalSubscriptions: 89,
    totalPayments: 12456.00,
    gptSpendings: 456.00,
    deepgramSpendings: 234.00
  };

  // Mock data for tables
  const subscriptionColumns = [
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => (

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.image} />
            <AvatarFallback>{row.original.name[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">
          ${row.original.amount.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "actions",
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
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.image} />
            <AvatarFallback>{row.original.name[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "workspace",
      header: "Workspace",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block
          ${row.original.status === 'Active' ? 'bg-green-100 text-green-700' :
            row.original.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'}`}>
          {row.original.status}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: () => (
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Eye className="h-4 w-4 text-gray-600" />
        </button>
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
            <Select defaultValue="today">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Chats"
              value={stats.today.totalChats}
              icon={<MessageSquare className="h-4 w-4" />}
              trend={8.2}
              trendUp={true}
              description="vs. last period"
            />
            <StatsCard
              title="Total Calls"
              value={stats.today.totalCalls}
              icon={<Phone className="h-4 w-4" />}
              trend={5.1}
              trendUp={true}
              description="vs. last period"
            />
            <StatsCard
              title="Total Vendors"
              value={stats.today.totalVendors}
              icon={<Users className="h-4 w-4" />}
              trend={2.3}
              trendUp={false}
              description="vs. last period"
            />
            <StatsCard
              title="Total Earnings"
              value={`$${stats.today.totalEarnings.toFixed(2)}`}
              icon={<DollarSign className="h-4 w-4" />}
              trend={12.5}
              trendUp={true}
              description="vs. last period"
            />
          </div>
        </div>

        {/* Financial Overview Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold  mb-6">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Subscriptions"
              value={financialStats.totalSubscriptions}
              icon={<CreditCard className="h-4 w-4" />}
              trend={4.5}
              trendUp={true}
              description={`${financialStats.totalSubscriptions} last month`}
            />
            <StatsCard
              title="Total Payments"
              value={`$${financialStats.totalPayments.toFixed(2)}`}
              icon={<Wallet className="h-4 w-4" />}
              trend={6.8}
              trendUp={true}
              description={`$${financialStats.totalPayments.toFixed(2)} last month`}
            />
            <StatsCard
              title="GPT Spendings"
              value={`$${financialStats.gptSpendings.toFixed(2)}`}
              icon={<Brain className="h-4 w-4" />}
              trend={2.1}
              trendUp={false}
              description={`$${financialStats.gptSpendings.toFixed(2)} last month`}
            />
            <StatsCard
              title="Deepgram Spendings"
              value={`$${financialStats.deepgramSpendings.toFixed(2)}`}
              icon={<Mic className="h-4 w-4" />}
              trend={3.4}
              trendUp={true}
              description={`$${financialStats.deepgramSpendings.toFixed(2)} last month`}
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
                data={generateSubscriptionData()}
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
                data={generateVendorData()}
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
const StatsCard = ({ title, value, icon, trend, trendUp, description }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-secondary rounded-lg">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {trend}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

// Mock data generators
const generateSubscriptionData = () => {
  const vendors = [
    { name: "Tech Corp", image: "https://api.dicebear.com/7.x/initials/svg?seed=TC" },
    { name: "Digital Solutions", image: "https://api.dicebear.com/7.x/initials/svg?seed=DS" },
    { name: "Smart Systems", image: "https://api.dicebear.com/7.x/initials/svg?seed=SS" },
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: vendors[i % vendors.length].name,
    image: vendors[i % vendors.length].image,
    amount: Math.floor(Math.random() * 1000) + 100,
    date: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
      .toLocaleDateString(),
  }));
};

const generateVendorData = () => {
  const vendors = [
    { name: "Cloud Services", image: "https://api.dicebear.com/7.x/initials/svg?seed=CS" },
    { name: "AI Solutions", image: "https://api.dicebear.com/7.x/initials/svg?seed=AS" },
    { name: "Data Corp", image: "https://api.dicebear.com/7.x/initials/svg?seed=DC" },
  ];

  const statuses = ["Active", "Pending", "Inactive"];
  const workspaces = ["Development", "Production", "Testing"];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: vendors[i % vendors.length].name,
    image: vendors[i % vendors.length].image,
    workspace: workspaces[i % workspaces.length],
    status: statuses[i % statuses.length],
    date: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)
      .toLocaleDateString(),
  }));
};

export default function DashboardPage() {
  return <DashboardLayout><Dashboard /></DashboardLayout>
}