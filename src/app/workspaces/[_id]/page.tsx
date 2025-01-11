"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, CreditCard, Lock, Eye, Image as ImageIcon } from "lucide-react";
import PageContainer from '@/components/layouts/page-container';
import DashboardLayout from '@/components/layouts/dashboard-layout';

// Mock data for workspaces


// Mock data for subscriptions
const subscriptionData = [
    {
        id: 1,
        srNo: 1,
        name: "Pro Plan",
        amount: 299,
        date: "2024-01-10",
    },
    {
        id: 2,
        srNo: 2,
        name: "Team Plan",
        amount: 199,
        date: "2024-01-05",
    },
];

// Mock data for workspace members
const memberData = [
    {
        id: 1,
        name: "Alice Smith",
        image: "/api/placeholder/32/32",
        role: "Admin",
        status: "Active",
    },
    {
        id: 2,
        name: "Bob Wilson",
        image: "/api/placeholder/32/32",
        role: "Member",
        status: "Active",
    },
];



// Column definitions for subscriptions
const subscriptionColumns = [
    {
        accessorKey: "srNo",
        header: "Sr No",
    },
    {
        accessorKey: "name",
        header: "Subscription Name",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => `$${row.original.amount}`,
    },
    {
        accessorKey: "date",
        header: "Date",
    },
];

// Column definitions for members
const memberColumns = [
    {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.image} alt={row.original.name} />
                    <AvatarFallback><ImageIcon className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <span>{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.status === "Active" ? "default" : "secondary"}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: () => (
            <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
            </Button>
        ),
    },
];

const WorkspaceModule = () => {
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
                    <CardContent className='space-y-8'>

                        <Card>

                            <CardContent className='pt-4'>
                                <div className="grid md:grid-cols-2 gap-4  p-3 ">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src="/api/placeholder/64/64" alt="Workspace" />
                                                <AvatarFallback><ImageIcon className="h-8 w-8" /></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="text-lg font-semibold">Design Team</h3>
                                                <p className="text-sm text-gray-500">Created Jan 2024</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">Active</Badge>
                                            <span className="text-sm text-gray-500">12 members</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-gray-500" />
                                            <span>$299/month</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Subscriptions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={subscriptionColumns}
                                    data={subscriptionData}
                                    totalItems={10}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Workspace Members</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={memberColumns}
                                    data={memberData}
                                    totalItems={10}
                                />
                            </CardContent>
                        </Card>

                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
};

export default function DashboardPage() {
    return <DashboardLayout><WorkspaceModule /></DashboardLayout>
};