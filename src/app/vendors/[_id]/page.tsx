"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    CreditCard
} from "lucide-react";
import PageContainer from '@/components/layouts/page-container';
import DashboardLayout from '@/components/layouts/dashboard-layout';



// Mock workspace data for vendor details
const workspaceInfo = {
    name: "Design Studio",
    image: "/api/placeholder/64/64",
    ownerName: "Sarah Chen",
    ownerImage: "/api/placeholder/32/32",
    memberCount: 12,
    status: "active",
    amount: 299,
};

// VendorDetails component
const VendorDetails = () => {
    return (
        <PageContainer>
            <div className="grid grid-cols-1 col-span-1">


                <div className="grid md:grid-cols-2 gap-6">
                    {/* Vendor Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-6 w-6" />
                                Vendor Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src="/api/placeholder/64/64" alt="John Smith" />
                                    <AvatarFallback><User className="h-8 w-8" /></AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-semibold">John Smith</h3>
                                    <p className="text-sm text-gray-500">Senior Designer</p>
                                    <Badge variant="default">Active</Badge>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Building2 className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Workspace:</span>
                                    <span>Design Studio</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Role:</span>
                                    <span>Senior Designer</span>
                                </div>
                            </div>

                            <Button variant="destructive" className="w-full">
                                <Lock className="h-4 w-4 mr-2" />
                                Block Vendor
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Workspace Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-6 w-6" />
                                Workspace Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={workspaceInfo.image} alt={workspaceInfo.name} />
                                    <AvatarFallback><ImageIcon className="h-8 w-8" /></AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-semibold">{workspaceInfo.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={workspaceInfo.status === "active" ? "default" : "secondary"}>
                                            {workspaceInfo.status}
                                        </Badge>
                                        <span className="text-sm text-gray-500">
                                            {workspaceInfo.memberCount} members
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={workspaceInfo.ownerImage} alt={workspaceInfo.ownerName} />
                                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{workspaceInfo.ownerName}</p>
                                        <p className="text-sm text-gray-500">Owner</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">${workspaceInfo.amount}</span>
                                    <span className="text-sm text-gray-500">/month</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default function DashboardPage() {
    return <DashboardLayout><VendorDetails /></DashboardLayout>
}