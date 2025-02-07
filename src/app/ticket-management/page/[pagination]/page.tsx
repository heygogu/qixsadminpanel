"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Search,
  Filter,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  Clock,
  MessageSquare,
  User,
  MoreHorizontal,
  ArrowLeft,
  MoreVertical,
  Eye,
} from "lucide-react";
import PageContainer from "@/components/layouts/page-container";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { debounce } from "lodash";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { search } from "superagent";
import henceforthApi from "@/utils/henceforthApis";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalContext } from "@/app/providers/Provider";
import dayjs from "dayjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// Mock data for tickets

// Status badge variants
type TicketStatus = "pending" | "resolved" | "closed";

const getStatusBadge = (status: TicketStatus) => {
  const variants = {
    pending: { variant: "secondary" as const, icon: Clock },
    resolved: { variant: "default" as const, icon: CheckCircle2 },
    closed: { variant: "secondary" as const, icon: XCircle },
  };
  const { variant, icon: Icon } = variants[status] || variants.pending;
  return (
    <Badge variant={variant} className="flex w-28 shadow-md gap-2">
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const TicketModule = () => {
  const [ticketListing, setTicketListing] = React.useState({
    data: [],
    count: 0,
    loading: false,
  });
  const { Toast } = useGlobalContext();
  console.log(ticketListing, "ticketListing");

  const params = useParams();
  const searchParams = useSearchParams();
  const getTicketListing = async () => {
    setTicketListing((prev) => ({ ...prev, loading: true }));
    try {
      let urlSearchParams = new URLSearchParams();
      if (params?.pagination) {
        urlSearchParams.set(
          "pagination",
          String((Number(params?.pagination) || 1) - 1)
        );
      }
      urlSearchParams.set("limit", "10");
      if (searchParams.get("search")) {
        urlSearchParams.set("search", searchParams.get("search") as string);
      }
      if (searchParams.get("status")) {
        urlSearchParams.set("status", searchParams.get("status") as string);
      }

      const res = await henceforthApi.SuperAdmin.getTickets(
        urlSearchParams.toString()
      );
      console.log(res?.data?.data, "res");
      setTicketListing((prev) => ({
        ...prev,
        data: res?.data?.data || [],
        count: res?.data?.count || 0,
      }));
    } catch (error) {
      Toast.error(error);
    } finally {
      setTicketListing((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await henceforthApi.SuperAdmin.deleteTicket(id);
      await getTicketListing();
      Toast.success("Ticket deleted successfully");
    } catch (error) {
      Toast.error(error);
    }
  };

  // Column definitions
  const ticketColumns = [
    {
      // accessorKey: "id",
      header: "Sr. no",
      cell: ({ row }) => <span className="w-5 pl-3">{row.index + 1}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12 border-2 border-white shadow-md">
            <AvatarImage
              src={henceforthApi.FILES.imageOriginal(row.original.profile_pic)}
              alt={row.original.name}
            />
            <AvatarFallback>
              {row.original.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-gray-500">{row.original.email}</span>
            <span className="text-xs text-gray-500">
              {row.original.country_code + row.original.phone_no}
            </span>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "subject",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original?.type}</span>
          <span className="text-xs text-gray-500">{row.original.subject}</span>
        </div>
      ),
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => (
        <div className="max-w-xs truncate">
          <MessageSquare className="h-4 w-4 text-gray-500 inline mr-2" />
          {row.original.message}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },

    {
      accessorKey: "created_at",
      header: "Created at",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {dayjs(row.original.created_at).format("DD MMM YYYY")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div>
            <Link
              href={`/ticket-management/${row.original?._id}/view`}
              passHref
            >
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            {/* <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button> */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <div className="flex items-center px-2 text-sm gap-2 py-1.5">
                    <ArrowLeft className="h-4 w-4" />
                    Change Status
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right">
                  <DropdownMenuItem
                    onClick={async () => {
                      try {
                        const res =
                          await henceforthApi.SuperAdmin.updateTicketStatus(
                            row.original._id,
                            {
                              status: "PENDING",
                            }
                          );
                        await getTicketListing();
                        Toast.success("Ticket status updated successfully");
                      } catch (error) {
                        Toast.error(error);
                      }
                    }}
                    className="text-yellow-600"
                  >
                    <Clock className="h-4 w-4" />
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      console.log("resolved");
                      try {
                        const res = henceforthApi.SuperAdmin.updateTicketStatus(
                          row.original._id,
                          {
                            status: "RESOLVED",
                          }
                        );
                        await getTicketListing();
                        Toast.success("Ticket status updated successfully");
                      } catch (error) {
                        Toast.error(error);
                      }
                    }}
                    className="text-green-600"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Resolved
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex text-red-500 cursor-pointer items-center px-2 text-sm gap-2 py-1.5">
                    <Trash2 className="h-4 w-4" />
                    Delete Ticket
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this ticket? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(row.original._id)}
                      className="bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const skeletonColumns = ticketColumns.map((column: any) => ({
    ...column,
    cell: () => <Skeleton className="h-5 p-3 bg-gray-200 animate-pulse" />,
  }));

  const [searchValue, setSearchValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Debounce search
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
          getTicketListing();
        }, 500),
      [searchParams]
    ),
    []
  );
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    const newSearchParams = new URLSearchParams(searchParams);
    if (value !== "all") {
      newSearchParams.set("status", value);
    } else {
      newSearchParams.delete("status");
    }
    window.history.pushState({}, "", `?${newSearchParams.toString()}`);
    getTicketListing();
  };

  useEffect(() => {
    getTicketListing();
  }, [
    params.pagination,
    searchParams.get("search"),
    searchParams.get("status"),
  ]);

  return (
    <PageContainer>
      <div className="space-y-6 grid grid-cols-1 col-span-1">
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
                  <MessageSquare className="h-6 w-6" />
                  <span>Support Tickets</span>
                </div>
              </CardTitle>
              <CardDescription>
                Manage and respond to customer support tickets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter Section */}
              <div className="flex flex-col md:flex-row gap-4">
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
                <div className="flex gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Data Table */}
              {ticketListing.loading ? (
                <DataTable
                  columns={skeletonColumns}
                  data={Array.from({ length: 6 })}
                  totalItems={10}
                />
              ) : (
                <DataTable
                  columns={ticketColumns}
                  data={ticketListing.data}
                  totalItems={ticketListing.count}
                />
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
      <TicketModule />
    </DashboardLayout>
  );
}
