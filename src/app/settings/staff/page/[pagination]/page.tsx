"use client";
import React, { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Pencil, Trash2, UserPen, User, Search } from "lucide-react";
import { DataTable } from "@/components/common/data-table";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { access } from 'fs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import henceforthApi from "@/utils/henceforthApis";
import { useParams, useSearchParams } from "next/navigation";
import { url } from "inspector";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { head } from "superagent";
import { useGlobalContext } from "@/app/providers/Provider";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

// Mock data

// Staff Listing Component
const StaffListing = () => {
  const [staffListing, setStaffListing] = React.useState({
    data: [],
    count: 0,
    loading: false,
  });
  const { Toast } = useGlobalContext();
  const [searchValue, setSearchValue] = React.useState("");
  const params = useParams();
  const searchParams = useSearchParams();
  const initStaffListing = async () => {
    setStaffListing((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      let urlSearchParams = new URLSearchParams();
      urlSearchParams.set("limit", "10");
      if (params?.pagination) {
        urlSearchParams.set(
          "pagination",
          String(Number(params?.pagination) - 1) || "0"
        );
      }
      if (searchParams.get("search")) {
        urlSearchParams.set("search", String(searchParams.get("search")));
      }
      const response = await henceforthApi.SuperAdmin.staffListing(
        urlSearchParams.toString()
      );
      setStaffListing((prev) => ({
        ...prev,
        data: response.data?.data || [],
        count: response.data.count,
      }));
      console.log(staffListing, "staffListing");
    } catch (error) {
      console.error(error);
    } finally {
      setStaffListing((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      const apiRes = await henceforthApi.SuperAdmin.deleteStaff(id);
      Toast.success("Staff deleted successfully");
      initStaffListing();
    } catch (error) {
      Toast.error(error);
    }
  };

  useEffect(() => {
    initStaffListing();
  }, [searchParams.get("search"), params?.pagination]);
  const columns = [
    {
      header: "Sr. no.",
      cell: ({ row }) => {
        const curretPage = Number(params?.pagination) || 1;
        const pageSize = Number(searchParams.get("limit")) || 10;
        return Number(curretPage - 1) * pageSize + (row.index + 1);
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="w-12 h-12 border-4 border-white shadow-lg">
            <AvatarImage
              className="object-cover"
              src={henceforthApi?.FILES?.imageOriginal(
                row.original?.profile_pic
              )}
              alt={row.original?.name}
            />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{row?.original?.name}</span>
            <span className="text-gray-500">{row?.original?.email}</span>
          </div>
        </div>
      ),
    },
    // {
    //   accessorKey: "email",
    //   header: "Email",
    //   cell: (info) => info?.getValue(),
    // },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => (
        <Badge
          variant={info?.getValue() === "ACTIVE" ? "default" : "destructive"}
          className={`mt-1 shadow-md ${
            info.getValue() === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {info.getValue()}
        </Badge>
      ),
    },
    {
      accessorKey: "module_permission",
      header: "Access Modules",
      cell: (info) => (
        <div className="flex flex-wrap gap-1 w-[250px]">
          {info
            ?.getValue()
            ?.slice(0, 3)
            ?.map((module: string) => (
              <Badge
                key={module}
                variant="secondary"
                className="bg-gray-100 capitalize text-gray-800"
              >
                {module}
              </Badge>
            ))}
          {info.getValue().length > 3 && (
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 capitalize text-gray-800 cursor-pointer"
                >
                  +{info?.getValue().length - 3}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  {info?.getValue()?.map((module: string) => (
                    <Badge
                      key={module}
                      variant="secondary"
                      className="bg-gray-100 capitalize text-gray-800"
                    >
                      {module}
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
      accessorKey: "created_at",
      header: "Join Date",
      cell: (info) => dayjs(info?.getValue()).format("DD MMM YYYY"),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/settings/staff/edit/${row?.original?._id}`} passHref>
            <Button variant="outline" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={(e) => handleDeleteStaff(row?.original?._id)}
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const skeletonColumns = columns.map((column: any) => ({
    ...column,
    cell: () => <Skeleton className="h-5 p-3 bg-gray-200 animate-pulse" />,
  }));
  const debouncedSearch = React.useCallback(
    React.useMemo(
      () =>
        debounce((value: string) => {
          const newSearchParams = new URLSearchParams(searchParams);
          if (value) {
            newSearchParams.set("search", value);
          } else {
            newSearchParams.delete("search");
          }
          window.history.pushState({}, "", `?${newSearchParams.toString()}`);
          initStaffListing();
        }, 500),
      [searchParams]
    ),
    []
  );
  return (
    <PageContainer>
      <div
        className={cn(
          "animate-in fade-in-50 duration-500 grid grid-cols-1",
          "slide-in-from-bottom-5"
        )}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex gap-2 text-2xl">
                  <UserPen className="h-7 w-7" />
                  Staff Management
                </CardTitle>
                <CardDescription>Manage and monitor your staff</CardDescription>
              </div>

              <Link href={`/settings/staff/create`} passHref>
                <Button className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add Staff
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative flex-1 items-center">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tickets..."
                className="pl-8"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  debouncedSearch(e.target.value);
                }}
              />
            </div>
            {staffListing.loading ? (
              <div className="mx-auto">
                <DataTable
                  columns={skeletonColumns}
                  data={Array.from({ length: 8 }, (_, index) => ({ index }))}
                  totalItems={8}
                />
              </div>
            ) : (
              <div className="mx-auto">
                <DataTable
                  columns={columns}
                  data={staffListing?.data}
                  totalItems={10}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

// export default StaffListing;
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <StaffListing />
    </DashboardLayout>
  );
}
