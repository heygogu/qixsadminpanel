"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    User,
    Search,
    Building2,
    Users,
    Filter,
    Eye,
    Lock,
    ArrowLeft,
    ImageIcon,
    CreditCard,
    UsersRound,

} from "lucide-react";
import DashboardLayout from '@/components/layouts/dashboard-layout';
import PageContainer from '@/components/layouts/page-container';
import Link from 'next/link';

// Mock data for vendors
const vendorData = [
    {
        id: 1,
        name: "John Smith",
        image: "/api/placeholder/32/32",
        workspace: "Design Studio",
        role: "Senior Designer",
        status: "active",
    },
    {
        id: 2,
        name: "Emma Wilson",
        image: "/api/placeholder/32/32",
        workspace: "Tech Hub",
        role: "Developer",
        status: "inactive",
    },
];

// Column definitions for vendor listing
const vendorColumns = [
    {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.image} alt={row.original.name} />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <span className="font-medium">{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "workspace",
        header: "Workspace",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span>{row.original.workspace}</span>
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
            <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Link href={`/vendors/${row.original.id}`} passHref>
                    <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>

            </div>
        ),
    },
];

// VendorListing component
const VendorListing = () => {
    return (
        <PageContainer>
            <div className="grid grid-cols-1 col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <UsersRound className="h-6 w-6" />
                                <span>Vendors Listing</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search and Filter Section */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search by name..."
                                    className="pl-8"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="designer">Designer</SelectItem>
                                        <SelectItem value="developer">Developer</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <DataTable
                            columns={vendorColumns}
                            data={vendorData}
                            totalItems={10}
                        />
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
};

export default function DashboardPage() {
    return <DashboardLayout><VendorListing /></DashboardLayout>
}
