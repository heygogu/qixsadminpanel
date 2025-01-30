"use client";
import React from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
// Mock data for tickets
const ticketData = [
  {
    id: 1,
    name: "John Carter",
    email: "john@example.com",
    phone: "+1 234-567-8900",
    subject: "Payment Issue",
    title: "Unable to process subscription",
    message:
      "I'm having trouble with my monthly payment processing. The transaction keeps failing.",
    status: "pending",
    priority: "high",
    createdAt: "2024-01-10T10:30:00",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 234-567-8901",
    subject: "Account Access",
    title: "Login problems after password reset",
    message: "Can't access my account after resetting password.",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-09T15:45:00",
  },
];

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
    <Badge variant={variant} className="flex items-center shadow-md gap-2">
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
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
          <AvatarImage src={row.original.image} alt={row.original.name} />
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
          <span className="text-xs text-gray-500">{row.original.phone}</span>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.title}</span>
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
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div>
          <Link href={`/ticket-management/${row.original.id}/view`} passHref>
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
            <DropdownMenuItem>
              <MessageSquare className="h-4 w-4 mr-2" />
              Reply
            </DropdownMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex items-center px-2 text-sm gap-2 py-1.5">
                  <ArrowLeft className="h-4 w-4" />
                  Change Status
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right">
                <DropdownMenuItem className="text-yellow-600">
                  <Clock className="h-4 w-4" />
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem className="text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Resolved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 " />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

const TicketModule = () => {
  return (
    <PageContainer>
      <div className=" space-y-6 grid grid-cols-1 col-span-1">
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
                  <Input placeholder="Search tickets..." className="pl-8" />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      {/* <SelectItem value="closed">Closed</SelectItem> */}
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Data Table */}
              <DataTable
                columns={ticketColumns}
                data={ticketData}
                totalItems={10}
              />
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
