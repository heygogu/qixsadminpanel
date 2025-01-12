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
import Link from 'next/link';

// Mock data for workspaces
const workspaceData = [
    {
        id: 1,
        name: "Design Team",
        image: "/api/placeholder/32/32",
        ownerName: "Sarah Chen",
        ownerImage: "/api/placeholder/32/32",
        memberCount: 12,
        status: "active",
        amount: 299,
    },
    {
        id: 2,
        name: "Development Hub",
        image: "/api/placeholder/32/32",
        ownerName: "Mike Johnson",
        ownerImage: "/api/placeholder/32/32",
        memberCount: 8,
        status: "inactive",
        amount: 199,
    },
];



// Column definitions for workspace listing
const workspaceColumns = [
    {
        accessorKey: "name",
        header: "Workspace",
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
        accessorKey: "ownerName",
        header: "Owner",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.ownerImage} alt={row.original.ownerName} />
                    <AvatarFallback><ImageIcon className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <span>{row.original.ownerName}</span>
            </div>
        ),
    },
    {
        accessorKey: "memberCount",
        header: "Members",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{row.original.memberCount}</span>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                ${row.original.amount}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Link href={`/workspaces/${row.original.id}`}>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>

                <Button variant="ghost" size="icon">
                    <Lock className="h-4 w-4" />
                </Button>
            </div>
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
                            Workspaces
                        </CardTitle>
                    </CardHeader>
                    <CardContent>



                        <DataTable
                            columns={workspaceColumns}
                            data={workspaceData}
                            totalItems={10}
                        />



                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
};

export default function DashboardPage() {
    return <DashboardLayout><WorkspaceModule /></DashboardLayout>
};