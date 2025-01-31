"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Users, CreditCard, ImageIcon } from "lucide-react";
import PageContainer from "@/components/layouts/page-container";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { useParams } from "next/navigation";
import henceforthApi from "@/utils/henceforthApis";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkspaceData {
  role: string;
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
  subscriptions: {
    _id: string;
    is_active: boolean;
  };
}
// Previous imports and interfaces remain the same...

const WorkspaceSkeletonCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-gray-200" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-6 w-16" />
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
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const WorkspacesSectionSkeleton = ({ title }: { title: string }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-gray-200" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <WorkspaceSkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

const VendorDetailsSkeleton = () => {
  return (
    <div className="space-y-8">
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
              <div className="flex gap-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48" />
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
        </CardContent>
      </Card>

      {/* Workspace Sections Skeletons */}
      <div className="space-y-12">
        <WorkspacesSectionSkeleton title="Owned Workspaces" />
        <WorkspacesSectionSkeleton title="Shared Workspaces" />
      </div>
    </div>
  );
};

// Rest of the components remain the same...
interface VendorDetailsResponse {
  _id: string;
  type: string;
  email: string;
  name: string;
  profile_pic: string | null;
  phone_no: string;
  country_code: string;
  country: string | null;
  status: string;
  subscription_detail: Record<string, never>;
  workspace_info: {
    owner: WorkspaceData[];
    shared: WorkspaceData[];
  };
}

const WorkspaceCard = ({
  workspace,
  type,
}: {
  workspace: WorkspaceData;
  type: "owned" | "shared";
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <span>Workspace</span>
          </div>
          <Badge variant="outline" className="shadow-sm">
            {type === "owned" ? "Owner" : "Shared"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 shadow-md border-2 border-white">
            <AvatarImage
              className="object-cover"
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
                variant="default"
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
                className="object-cover"
                src={henceforthApi.FILES?.imageOriginal(
                  workspace.owner?.profile_pic ?? "",
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
              <p className="text-sm text-gray-500">
                {type === "owned"
                  ? "Owner"
                  : `Shared by ${workspace.owner?.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <span className="font-medium">$100</span>
              <span className="text-sm text-gray-500">/month</span>
            </div>
            <Badge
              variant={
                workspace.subscriptions.is_active ? "default" : "secondary"
              }
            >
              {workspace.subscriptions.is_active
                ? "Active Sub"
                : "Inactive Sub"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const WorkspacesSection = ({
  title,
  workspaces,
  type,
}: {
  title: string;
  workspaces: WorkspaceData[];
  type: "owned" | "shared";
}) => {
  if (!workspaces?.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        {title} ({workspaces.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace._id}
            workspace={workspace}
            type={type}
          />
        ))}
      </div>
    </div>
  );
};

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

  const totalWorkspaces =
    (vendorDetails?.workspace_info?.owner?.length || 0) +
    (vendorDetails?.workspace_info?.shared?.length || 0);

  return (
    <PageContainer>
      <div className="space-y-8">
        {loading ? (
          <VendorDetailsSkeleton />
        ) : (
          <>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Vendor Details
                </CardTitle>
                <CardDescription>
                  Manage and view all vendor details
                </CardDescription>
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
                  <div>
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
                    <span>{totalWorkspaces}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Role:</span>
                    <span>{vendorDetails?.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {vendorDetails?.workspace_info && (
              <div className="space-y-12">
                <WorkspacesSection
                  title="Owned Workspaces"
                  workspaces={vendorDetails.workspace_info.owner}
                  type="owned"
                />
                <WorkspacesSection
                  title="Shared Workspaces"
                  workspaces={vendorDetails.workspace_info.shared}
                  type="shared"
                />
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
