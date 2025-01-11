"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Building2,
    Search,
    Filter,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
    ImageIcon
} from "lucide-react";
import PageContainer from '@/components/layouts/page-container';
import DashboardLayout from '@/components/layouts/dashboard-layout';

// Mock data for accounting entries
const accountingData = [
    {
        id: 1,
        orderNumber: "ORD-2024-001",
        workspaceName: "Design Studio Pro",
        workspaceImage: "/api/placeholder/32/32",
        date: "2024-01-10",
        amount: 499.99,
        expense: 150.00,
        earning: 349.99,
    },
    {
        id: 2,
        orderNumber: "ORD-2024-002",
        workspaceName: "Tech Hub Plus",
        workspaceImage: "/api/placeholder/32/32",
        date: "2024-01-11",
        amount: 299.99,
        expense: 89.99,
        earning: 210.00,
    },
];

// Summary metrics for the dashboard
const summaryMetrics = {
    totalEarnings: 559.99,
    totalExpenses: 239.99,
    totalRevenue: 799.98,
    growthRate: 12.5,
};

// Column definitions
const accountingColumns = [
    {
        accessorKey: "orderNumber",
        header: "Order Number",
        cell: ({ row }) => (
            <span className="font-medium">{row.original.orderNumber}</span>
        ),
    },
    {
        accessorKey: "workspaceName",
        header: "Workspace",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.workspaceImage} alt={row.original.workspaceName} />
                    <AvatarFallback><ImageIcon className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <span>{row.original.workspaceName}</span>
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                {new Date(row.original.date).toLocaleDateString()}
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
        accessorKey: "expense",
        header: "Expense",
        cell: ({ row }) => (
            <div className="flex items-center gap-1 text-red-500">
                <ArrowDownRight className="h-4 w-4" />
                ${row.original.expense.toFixed(2)}
            </div>
        ),
    },
    {
        accessorKey: "earning",
        header: "Earning",
        cell: ({ row }) => (
            <div className="flex items-center gap-1 text-green-500">
                <ArrowUpRight className="h-4 w-4" />
                ${row.original.earning.toFixed(2)}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
            </Button>
        ),
    },
];

const AccountingModule = () => {
    return (
        <PageContainer>
            <div className="grid grid-cols-1 col-span-1 space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                                    <h3 className="text-2xl font-bold mt-2">${summaryMetrics.totalRevenue.toFixed(2)}</h3>
                                </div>
                                <div className="p-2 bg-blue-500 rounded-lg text-white">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</p>
                                    <h3 className="text-2xl font-bold mt-2">${summaryMetrics.totalEarnings.toFixed(2)}</h3>
                                </div>
                                <div className="p-2 bg-green-500 rounded-lg text-white">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
                                    <h3 className="text-2xl font-bold mt-2">${summaryMetrics.totalExpenses.toFixed(2)}</h3>
                                </div>
                                <div className="p-2 bg-red-500 rounded-lg text-white">
                                    <TrendingDown className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Growth Rate</p>
                                    <h3 className="text-2xl font-bold mt-2">{summaryMetrics.growthRate}%</h3>
                                </div>
                                <div className="p-2 bg-purple-500 rounded-lg text-white">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-6 w-6" />
                                <span>Accounting Overview</span>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Track all subscription payments, expenses, and earnings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search and Filter Section */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search by order number or workspace..."
                                    className="pl-8"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Date Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="week">This Week</SelectItem>
                                        <SelectItem value="month">This Month</SelectItem>
                                        <SelectItem value="year">This Year</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <DataTable
                            columns={accountingColumns}
                            data={accountingData}
                            totalItems={10}
                        />
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
};

// export default AccountingModule;
export default function DashboardPage() {
    return <DashboardLayout>
        <AccountingModule />
    </DashboardLayout>
}