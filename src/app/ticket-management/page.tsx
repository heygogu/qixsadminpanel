"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Search,
    Filter,
    Mail,
    Phone,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Trash2,
    Clock,
    MessageSquare,
    User,
} from "lucide-react";
import PageContainer from '@/components/layouts/page-container';
import DashboardLayout from '@/components/layouts/dashboard-layout';
// Mock data for tickets
const ticketData = [
    {
        id: 1,
        name: "John Carter",
        email: "john@example.com",
        phone: "+1 234-567-8900",
        subject: "Payment Issue",
        title: "Unable to process subscription",
        message: "I'm having trouble with my monthly payment processing. The transaction keeps failing.",
        status: "pending",
        priority: "high",
        createdAt: "2024-01-10T10:30:00",
    },
    {
        id: 2,
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "+1 234-567-8901",
        subject: "Account Access",
        title: "Login problems after password reset",
        message: "Can't access my account after resetting password.",
        status: "resolved",
        priority: "medium",
        createdAt: "2024-01-09T15:45:00",
    },
];

// Status badge variants
const getStatusBadge = (status) => {
    const variants = {
        pending: { variant: "warning", icon: Clock },
        resolved: { variant: "success", icon: CheckCircle2 },
        closed: { variant: "secondary", icon: XCircle },
    };
    const { variant, icon: Icon } = variants[status] || variants.pending;
    return (
        <Badge variant={variant} className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

// Priority badge variants
const getPriorityBadge = (priority) => {
    const variants = {
        high: "destructive",
        medium: "warning",
        low: "secondary",
    };
    return (
        <Badge variant={variants[priority] || "secondary"}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
    );
};

// Column definitions
const ticketColumns = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-xs text-gray-500">{row.original.email}</span>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                {row.original.phone}
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.title}</span>
                <span className="text-xs text-gray-500">{row.original.subject}</span>
            </div>
        ),
    },
    {
        accessorKey: "message",
        header: "Message",
        cell: ({ row }) => (
            <div className="max-w-xs truncate">
                <MessageSquare className="h-4 w-4 text-gray-500 inline mr-2" />
                {row.original.message}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => getPriorityBadge(row.original.priority),
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
            <div className="text-sm text-gray-500">
                {new Date(row.original.createdAt).toLocaleDateString()}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-700"
                >
                    <Mail className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-500 hover:text-green-700"
                    disabled={row.original.status === 'resolved'}
                >
                    <CheckCircle2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];

const TicketModule = () => {
    return (
        <PageContainer>


            <div className=" space-y-6 grid grid-cols-1 col-span-1">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-yellow-50 dark:bg-yellow-900/20">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Tickets</p>
                                    <h3 className="text-2xl font-bold mt-2">5</h3>
                                </div>
                                <Clock className="h-5 w-5 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 dark:bg-green-900/20">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved Today</p>
                                    <h3 className="text-2xl font-bold mt-2">12</h3>
                                </div>
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50 dark:bg-red-900/20">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">High Priority</p>
                                    <h3 className="text-2xl font-bold mt-2">3</h3>
                                </div>
                                <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-6 w-6" />
                                <span>Support Tickets</span>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Manage and respond to customer support tickets
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search and Filter Section */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search tickets..."
                                    className="pl-8"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priority</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <DataTable
                            columns={ticketColumns}
                            data={ticketData}
                            totalItems={10}
                        />
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
};

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <TicketModule />
        </DashboardLayout>
    )
}