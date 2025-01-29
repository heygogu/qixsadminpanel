"use client";
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Building2,
  Users,
  Lock,
  ImageIcon,
  CreditCard,
} from "lucide-react";
import PageContainer from "@/components/layouts/page-container";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useParams } from "next/navigation";
import henceforthApi from "@/app/utils/henceforthApis";
import { Skeleton } from "@/components/ui/skeleton";

// Updated VendorDetailsSkeleton component

interface VendorDetailsResponse {
  _id: string;
  type: string;
  email: string;
  name: string;
  profile_pic: string;
  phone_no: string;
  country_code: string;
  country: string | null;
  status: string;
  subscription_detail: {
    _id: string;
    status: string;
    start_date: number;
    end_date: number;
    is_active: boolean;
    created_at: number;
    plan_name: string;
  };
  workspace_info: Array<{
    _id: string;
    name: string;
    image: string;
    description: string;
    status: string;
    created_at: number;
    member_counts: number;
    owner: {
      _id: string;
      email: string;
      name: string;
      profile_pic: string | null;
    };
  }>;
}

const VendorDetailsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Vendor Details Card Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-gray-200" />
            Vendor Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          <div className="space-y-3">
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

          {/* <div className="flex items-center">
            <Skeleton className="h-10 w-full rounded-md" />
          </div> */}
        </CardContent>
      </Card>

      {/* Workspace Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-gray-200" />
                <Skeleton className="h-6 w-48" />
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
        ))}
      </div>
    </div>
  );
};

// WorkspaceCard component
const WorkspaceCard = ({ workspace }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Workspace Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 shadow-md border-2 border-white">
            <AvatarImage
              className="object-cover "
              src={workspace.image}
              alt={workspace.name}
            />
            <AvatarFallback>
              <ImageIcon className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{workspace.name}</h3>
            <div className="flex items-center gap-2">
              <Badge
                variant={"default"}
                className={`shadow-md ${
                  workspace.status === "UNBLOCK" && "bg-green-500"
                }`}
              >
                {workspace.status === "UNBLOCK" ? "Active" : "Blocked"}
              </Badge>
              <span className="text-sm text-gray-500">
                {workspace.member_counts} members
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarImage
                className="object-cover "
                src={henceforthApi.FILES?.imageOriginal(
                  workspace.owner?.profile_pic,
                  ""
                )}
                alt="Owner image"
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{workspace.owner?.name}</p>
              <p className="text-sm text-gray-500">Owner</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-500" />
            <span className="font-medium">$100</span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// VendorDetails component
const VendorDetails = () => {
  const params = useParams();
  const [vendorDetails, setVendorDetails] =
    React.useState<VendorDetailsResponse | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getVendorDetails = async () => {
    setLoading(true);
    try {
      const apiRes = await henceforthApi.SuperAdmin.vendorDetail(
        String(params._id)
      );
      setVendorDetails(apiRes?.data);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendorDetails();
  }, []);

  return (
    <PageContainer>
      <div className="space-y-6">
        {loading ? (
          <VendorDetailsSkeleton />
        ) : (
          <>
            {/* Vendor Details Card */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Vendor Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 shadow-md border-2 border-white">
                    <AvatarImage
                      src={henceforthApi.FILES.imageOriginal(
                        vendorDetails?.profile_pic ?? "",
                        ""
                      )}
                      alt={vendorDetails?.name}
                    />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="">
                    <div className="flex gap-3">
                      <h3 className="text-lg font-semibold">
                        {vendorDetails?.name}
                      </h3>
                      <Badge className="shadow-md" variant="default">
                        {vendorDetails?.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {vendorDetails?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Total Workspaces:</span>
                    <span>{vendorDetails?.workspace_info?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Role:</span>
                    <span>{vendorDetails?.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workspaces Grid */}
            {vendorDetails?.workspace_info && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendorDetails.workspace_info.map((workspace) => (
                  <WorkspaceCard key={workspace._id} workspace={workspace} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <VendorDetails />
    </DashboardLayout>
  );
}
