"use client";
import React, { useEffect, useRef, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { DataTable } from "@/components/common/data-table";
import PageContainer from "@/components/layouts/page-container";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import henceforthApi from "@/utils/henceforthApis";
import { set } from "react-hook-form";
import { useGlobalContext } from "@/app/providers/Provider";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationCompo from "@/components/common/Pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WhiteLabelSubmissions = () => {
  const [listing, setListing] = useState({
    data: [],
    count: 0,
    loading: false,
  });
  const { Toast } = useGlobalContext();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = React.useState(
    () => searchParams?.get("search") || ""
  );
  const params = useParams();
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout>();
  const getListingData = async () => {
    setListing({ ...listing, loading: true });
    try {
      let urlSearchParam = new URLSearchParams();
      if (params?.pagination) {
        urlSearchParam.set(
          "pagination",
          String(Number(params?.pagination) - 1) || "0"
        );
      }
      const searchQuery = searchParams.get("search");
      if (searchQuery) {
        urlSearchParam.append("search", searchQuery);
      }
      if (searchParams.get("limit")) {
        urlSearchParam.set("limit", searchParams.get("limit") as string);
      } else {
        urlSearchParam.set("limit", String(10));
      }
      const apiRes = await henceforthApi.SuperAdmin.whiteLabelListing(
        urlSearchParam.toString()
      );
      setListing({
        ...listing,
        data: apiRes?.data?.data || [],
        count: apiRes?.data?.count || 0,
        loading: false,
      });
    } catch (error) {
      Toast.error(error);
    }
  };
  const handleSearch = (value: string) => {
    const query = new URLSearchParams(searchParams?.toString());
    if (value) {
      query.set("search", value);
    } else {
      query.delete("search");
    }
    router.replace(`/white-label-leads/page/1?${query.toString()}`, {
      scroll: false,
    });
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

  useEffect(() => {
    getListingData();
  }, [searchParams.get("search"), params?.pagination]);
  const getStatusBadge = (status) => {
    const variants = {
      new: "bg-green-100 text-green-800",
      contacted: "bg-blue-100 text-blue-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const columns: any = [
    {
      header: "Sr No",
      accessorKey: "id",
      cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone_no",
      cell: ({ row }) => (
        <span>{row.original.country_code + row.original.phone_no}</span>
      ),
    },
    {
      header: "Message",
      accessorKey: "message",
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger>
            <span>
              {row.original.message.length > 30
                ? row.original.message.slice(0, 30) + "..."
                : row.original.message}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] whitespace-normal break-words">
            {row.original.message}
          </TooltipContent>
        </Tooltip>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },

    {
      header: "Submitted on",
      accessorKey: "created_on",
      cell: ({ value }) => <span>{dayjs(value).format("DD MMM YYYY")} </span>,
    },
  ];

  const handlePageChange = (page: number) => {
    const query = new URLSearchParams(searchParams?.toString());

    router.replace(`/white-label-leads/page/${page}?${query.toString()}`, {
      scroll: false,
    });
  };

  const skeletonColumns = columns.map((column: any) => ({
    ...column,
    cell: () => <Skeleton className="h-5 p-3 bg-gray-200 animate-pulse" />,
  }));

  return (
    <PageContainer>
      <div
        className={cn(
          "animate-in fade-in-50 grid grid-cols-1 duration-500 col-span-12",
          "slide-in-from-bottom-5"
        )}
      >
        <div className="space-y-6 col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-6 w-6" />
                    White Label Leads
                  </CardTitle>
                  <CardDescription>
                    Manage and view all white label solution inquiries
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2"></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative flex items-center gap-2">
                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search submissions..."
                  className="pl-8 "
                  onChange={(e) => onSearch(e.target.value)}
                />
                {/* <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button> */}
              </div>

              {listing.loading ? (
                <DataTable
                  columns={skeletonColumns}
                  data={Array.from({ length: 6 })}
                  totalItems={10}
                />
              ) : (
                <DataTable
                  columns={columns}
                  data={listing?.data}
                  totalItems={listing?.count}
                />
              )}
              <div className="flex justify-center mt-6">
                <PaginationCompo
                  currentPage={Number(params?.pagination) || 1}
                  itemsPerPage={Number(searchParams.get("limit")) || 10}
                  totalDataCount={listing?.count}
                  onPageChange={handlePageChange}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default function WhiteLabel() {
  return (
    <DashboardLayout>
      <WhiteLabelSubmissions />
    </DashboardLayout>
  );
}
