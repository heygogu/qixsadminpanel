"use client";
import React, { useEffect } from 'react';
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
import { useParams } from 'next/navigation';
import henceforthApi from '@/app/utils/henceforthApis';
import { Skeleton } from '@/components/ui/skeleton';



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

interface VendorDetailsResponse {
    _id: string;
    workspace_id: {
        _id: string;
        name: string;
        created_by: {
            _id: string;
            name: string;
            profile_pic: string | null;
        };
        index_name: string;
        image: string;
        description: string;
        status: string;
        created_at: number;
        updated_at: number;
        __v: number;
    };
    email: string;
    vendor_id: string;
    role: string;
    status: string;
    is_invite: boolean;
    vendor_roles: string[];
    created_at: number;
    updated_at: number;
}
const VendorDetailsSkeleton = () => {
    return (
        <div className="grid md:grid-cols-2 gap-6 animate-pulse">
            {/* Vendor Details Card Skeleton */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-gray-200" />
                        {/* <Skeleton className="h-6 w-32" /> */}
                        Vendor Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                    </div>

                    <div className="pt-4 border-t space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>

                    <Skeleton className="h-10 w-full rounded-md" />
                </CardContent>
            </Card>

            {/* Workspace Info Card Skeleton */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-gray-200" />
                        {/* <Skeleton className="h-6 w-48" /> */}
                        Workspace Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-3/4" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1 flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


// VendorDetails component
const VendorDetails = () => {


    const params = useParams();
    const [vendorDetails, setVendorDetails] = React.useState<VendorDetailsResponse | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const getVendorDetails = async () => {
        setLoading(true);
        try {
            const apiRes = await henceforthApi.SuperAdmin.vendorDetail(String(params._id));
            setVendorDetails(apiRes?.data?.[0]);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getVendorDetails();
    }, [])
    return (
        <PageContainer>
            <div className="grid grid-cols-1 col-span-1">

                {loading ? <VendorDetailsSkeleton /> : <div className="grid md:grid-cols-2 gap-6">
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
                                    <h3 className="text-xl font-semibold">{vendorDetails?.email}</h3>
                                    <p className="text-sm text-gray-500">{vendorDetails?.role}</p>
                                    <Badge variant="default">{vendorDetails?.role}</Badge>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Building2 className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Workspace:</span>
                                    <span>{vendorDetails?.workspace_id?.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Role:</span>
                                    <span>{vendorDetails?.role}</span>
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
                                    <AvatarImage className='object-cover' src={vendorDetails?.workspace_id?.image} alt={vendorDetails?.workspace_id?.name} />
                                    <AvatarFallback><ImageIcon className="h-8 w-8" /></AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-semibold">{vendorDetails?.workspace_id?.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={workspaceInfo.status === "active" ? "default" : "secondary"}>
                                            {vendorDetails?.workspace_id?.status === "UNBLOCK" ? "Active" : "Blocked"}
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
                                        <AvatarImage className='object-cover' src={henceforthApi.FILES?.imageOriginal(vendorDetails?.workspace_id?.created_by?.profile_pic ?? "", "")} alt={"Owner image"} />
                                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{vendorDetails?.workspace_id?.created_by?.name}</p>
                                        <p className="text-sm text-gray-500">{vendorDetails?.role}</p>
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
                </div>}

            </div>
        </PageContainer>
    );
};

export default function DashboardPage() {
    return <DashboardLayout><VendorDetails /></DashboardLayout>
}