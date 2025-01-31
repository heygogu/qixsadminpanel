"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  ArrowLeft,
  MoreVertical,
  Calendar,
  Send,
  Trash2,
  AlertCircle,
  Tag,
  Building,
  CreditCard,
} from "lucide-react";
import PageContainer from "@/components/layouts/page-container";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { cn } from "@/lib/utils";
import Link from "next/link";
import henceforthApi from "@/utils/henceforthApis";
import dayjs from "dayjs";
import { useGlobalContext } from "@/app/providers/Provider";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { set } from "react-hook-form";

const TicketDetailSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>
              <Skeleton className="w-1/2" />
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-4">
                <Skeleton className="w-1/4" />
                <Skeleton className="w-1/4" />
              </div>
            </CardDescription>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white shadow-md">
                <AvatarFallback>
                  <Skeleton className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  <Skeleton className="w-1/2" />
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <Skeleton className="w-1/4" />
                  <Skeleton className="w-1/4" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Skeleton className="w-1/4" />
                  <Skeleton className="w-1/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">
                <Skeleton className="w-1/2" />
              </h3>
              <p>
                <Skeleton className="w-3/4" />
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-1/4" />
                  <Skeleton className="w-1/4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton
                    className="
                  w-1/4"
                  />
                  <Skeleton className="w-1/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TicketDetails = ({ params }: { params: { _id: string } }) => {
  const [ticket, setTicket] = useState<any>(null);
  const router = useRouter();
  const { Toast } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const getTicketDetails = async () => {
    setLoading(true);
    try {
      const res = await henceforthApi.SuperAdmin.getTicketDetails(params._id);
      setTicket(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (newStatus: string) => {
    // setCurrentStatus(newStatus);
    const status = newStatus.toUpperCase();
    try {
      const res = await henceforthApi.SuperAdmin.updateTicketStatus(
        params._id,
        {
          status,
        }
      );
      getTicketDetails();
      Toast.success("Ticket status updated successfully");
    } catch (error) {
      Toast.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await henceforthApi.SuperAdmin.deleteTicket(params._id);
      router.replace("/ticket-management/page/1");
      Toast.success("Ticket deleted successfully");
    } catch (error) {
      Toast.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: {
        variant: "secondary" as const,
        icon: Clock,
        color: "text-yellow-600",
      },
      resolved: {
        variant: "default" as const,
        icon: CheckCircle2,
        color: "text-white",
      },
      closed: {
        variant: "secondary" as const,
        icon: XCircle,
        color: "text-gray-600",
      },
    };
    const { variant, icon: Icon, color } = variants[status] || variants.pending;
    return (
      <Badge variant={variant} className={cn("flex items-center gap-1", color)}>
        <Icon className="h-3 w-3" />
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  useEffect(() => {
    getTicketDetails();
  }, []);

  return (
    <PageContainer>
      <div className="grid grid-cols-1  ">
        <div
          className={cn(
            "animate-in fade-in-50 duration-500 col-span-1",
            "slide-in-from-bottom-5 space-y-6"
          )}
        >
          <div className="flex items-center justify-between">
            <Link href="/ticket-management/page/1">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tickets
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {/* {getStatusBadge(currentStatus)} */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Change Status
                    <MoreVertical className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled={ticket?.status === "pending"}
                    onClick={() => handleStatusChange("pending")}
                    className="text-yellow-600"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={ticket?.status === "resolved"}
                    onClick={() => handleStatusChange("resolved")}
                    className="text-green-600"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Resolved
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem
                    onClick={() => handleStatusChange("closed")}
                    className="text-gray-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Closed
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                      onClick={handleDelete}
                      className="bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid grid-cols-1 ">
            {/* Main Ticket Content */}

            {loading ? (
              <TicketDetailSkeleton />
            ) : (
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle>{ticket?.type ?? "adgfergers"}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-4">
                            <span>{ticket?.subject}</span>
                            <span>{getStatusBadge(ticket?.status)}</span>
                          </div>
                        </CardDescription>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border-4 border-white shadow-md">
                            <AvatarImage
                              src={henceforthApi?.FILES.imageOriginal(
                                ticket?.profile_pic
                              )}
                            />
                            <AvatarFallback>
                              {ticket?.name?.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{ticket?.name}</h3>
                            {/* <p className="text-sm text-gray-500">Premium Customer</p> */}
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span>{ticket?.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>
                                {ticket?.country_code + ticket?.phone_no}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Ticket Details */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">Description</h3>
                          <p>{ticket?.message}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
                                Category: {ticket?.type}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">
                                Created on:{" "}
                                {dayjs(ticket?.created_at).format(
                                  "DD MMM YYYY"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <Separator /> */}

                      {/* Admin Remarks History */}
                      {/* <div className="space-y-4">
                      <h3 className="font-semibold">Admin Remarks History</h3>
                      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <div className="space-y-4">
                    
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Admin</span>
                              <span className="text-sm text-gray-500">
                                Jan 10, 2024 10:35 AM
                              </span>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm">
                                Investigating the payment processing issue.
                                Customer's card appears to be declined due to
                                insufficient funds.
                              </p>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </div> */}
                    </div>
                  </CardContent>
                  {/* <CardFooter>
                  <div className="w-full space-y-2">
                    <h4 className="font-medium">Add Admin Remark</h4>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add your remark here..."
                        value={adminRemark}
                        onChange={(e) => setAdminRemark(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleRemarkSubmit}
                        className=" rounded-full"
                      >
                        <Send className="" />
                      </Button>
                    </div>
                  </div>
                </CardFooter> */}
                </Card>
              </div>
            )}
          </div>
        </div>
        {/* Header */}
      </div>
    </PageContainer>
  );
};

export default function TicketDetailsPage({
  params,
}: {
  params: { _id: string };
}) {
  return (
    <DashboardLayout>
      <TicketDetails params={params} />
    </DashboardLayout>
  );
}
