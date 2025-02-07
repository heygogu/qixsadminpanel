"use client";
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Shield,
  LockOpen,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import henceforthApi from "@/utils/henceforthApis";
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";
import PaginationCompo from "@/components/common/Pagination";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalContext } from "@/app/providers/Provider";

// Mock data for vendors

interface Vendor {
  _id: string;
  type: string;
  email: string;
  name: string;
  company_logo: string | null;
  company_name: string | null;
  company_color: string | null;
  company_url: string | null;
  username: string | null;
  customer_id: string | null;
  super_admin: boolean;
  roles: string[];
  profile_pic: string | null;
  phone_no: string;
  country_code: string;
  country: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  account_status: string;
  status: string;
  ai_call_notification: boolean;
  ai_chat_notification: boolean;
  ai_human_notification: boolean;
  created_at: number;
  updated_at: number;
  workspace: {
    _id: string;
    name: string;
    logo: string;
    color: string;
  }[];
}
// Column definitions for vendor listing

// VendorListing component
const VendorListing = () => {
  const params = useParams();
  const router = useRouter();
  const { Toast } = useGlobalContext();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState(
    () => searchParams?.get("search") || ""
  );
  const timerRef = useRef<NodeJS.Timeout>();
  const [vendorListing, setVendorListing] = React.useState<{
    data: Vendor[];
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const initData = async () => {
    setIsLoading(true);
    const urlSearchParams = new URLSearchParams();
    if (params?.pagination) {
      const pagination = Number(params?.pagination) - 1;
      urlSearchParams.append("pagination", pagination.toString());
    }
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      urlSearchParams.append("search", searchQuery);
    }
    urlSearchParams.append("limit", "10");
    try {
      const apiRes = await henceforthApi.SuperAdmin.vendorListing(
        urlSearchParams
      );
      setVendorListing({
        ...vendorListing,
        data: apiRes?.data?.data,
        count: apiRes?.data?.count,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    const query = new URLSearchParams(searchParams?.toString());
    if (value) {
      query.set("search", value);
    } else {
      query.delete("search");
    }
    router.replace(`/vendors/page/1?${query.toString()}`, { scroll: false });
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      handleSearch(value.trim());
    }, 500);
  };

  const handleVendorStatus = async (id: string, status: string) => {
    try {
      const realStatus = status === "ACTIVE" ? "BLOCK" : "ACTIVE";
      const res = await henceforthApi.SuperAdmin.toogleVendorStatus(
        id,
        realStatus
      );
      Toast.success(
        `Vendor ${realStatus === "ACTIVE" ? "Activated" : "Blocked"}!`
      );
      await initData();
      console.log(res);
    } catch (error) {
      console.log(error);
      Toast.error(error);
    }
  };
  const vendorColumns: ColumnDef<Vendor>[] = [
    {
      id: "index",
      header: ({ column }) => {
        return <span className="w-5 ml-1">Sr. No.</span>;
      },
      cell: ({ row }) => {
        const currentPage = Number(useParams().pagination) - 1;
        const itemsPerPage = 10;
        const index = currentPage * itemsPerPage + row.index + 1;
        return <span className="w-5 pl-3">{index}</span>;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <span className=" ml-3 lg:ml-0">Name</span>;
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2 w-56 lg:w-32">
          <Avatar className="h-10 w-10 shadow-md border-2 border-white">
            <AvatarImage
              className="object-cover"
              src={henceforthApi.FILES.imageOriginal(
                row.original?.profile_pic || ""
              )}
              alt={row.original.name}
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-gray-500">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    // {
    //     accessorKey: "workspace",
    //     header: "Workspace",
    //     cell: ({ row }) => (
    //         <div className="flex items-center gap-2">
    //             <Building2 className="h-4 w-4 text-gray-500" />
    //             <span>{row.original.workspace}</span>
    //         </div>
    //     ),
    // },
    {
      header: "Workspace",
      accessorKey: "workspace",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 w-[200px]">
          {row.original.workspace?.slice(0, 3)?.map((workspace) => (
            <Badge
              key={workspace.name}
              variant="secondary"
              className="bg-gray-200 shadow-md capitalize text-gray-800"
            >
              {workspace.name}
            </Badge>
          ))}
          {row.original.workspace?.length > 3 && (
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 capitalize text-gray-800 cursor-pointer"
                >
                  +{row.original.workspace.length - 3}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  {row.original.workspace?.map((workspace) => (
                    <Badge
                      key={workspace.name}
                      variant="secondary"
                      className="bg-gray-100 capitalize text-gray-800"
                    >
                      {workspace.name}
                    </Badge>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "ACTIVE" ? "default" : "destructive"}
          className={`shadow-md ${
            row.original.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.original.status === "ACTIVE"
            ? "Active"
            : row.original.status === "BLOCK"
            ? "Blocked"
            : "Unknown"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/vendors/${row.original._id}/view`} passHref>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              handleVendorStatus(row?.original?._id, row?.original?.status)
            }
          >
            {row.original?.status === "ACTIVE" ? (
              <Tooltip>
                <TooltipTrigger>
                  <Lock className="h-full w-full text-red-500" />
                </TooltipTrigger>
                <TooltipContent>Block</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <LockOpen className="h-full w-full text-green-500" />
                </TooltipTrigger>
                <TooltipContent>Unblock</TooltipContent>
              </Tooltip>
            )}
          </Button>
        </div>
      ),
    },
  ];
  const skeletonColumns = vendorColumns.map((column: any) => ({
    ...column,
    cell: () => <Skeleton className="h-5 p-3 bg-gray-200 animate-pulse" />,
  }));

  const handlePageChange = (page: number) => {
    const query = new URLSearchParams(searchParams?.toString());

    router.replace(`/vendors/page/${page}?${query.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    initData();
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  return (
    <PageContainer>
      <div className="grid grid-cols-1 col-span-1">
        <div
          className={cn(
            "animate-in fade-in-50 duration-500 col-span-12",
            "slide-in-from-bottom-5"
          )}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersRound className="h-6 w-6" />
                  <span>Vendors</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter Section */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 ">
                  <Search className="absolute left-2 top-3 h-4 w-4  text-gray-500" />
                  <Input
                    placeholder="Search by vendor name..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => onSearch(e.target.value)}
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
                  {/* <Select>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                    </SelectContent>
                  </Select> */}
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <DataTable
                  columns={skeletonColumns}
                  data={Array.from({ length: 10 })}
                  totalItems={10}
                />
              ) : (
                <DataTable
                  columns={vendorColumns}
                  data={vendorListing?.data}
                  totalItems={10}
                />
              )}
              {vendorListing?.data?.length ? (
                <div className="flex justify-center mt-6">
                  <PaginationCompo
                    currentPage={Number(params?.pagination) || 1}
                    itemsPerPage={Number(searchParams.get("limit")) || 10}
                    totalDataCount={vendorListing?.count}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                ""
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <VendorListing />
    </DashboardLayout>
  );
}
