// app/page-management/page.tsx
"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, PenSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import { DataTable } from "@/components/common/data-table";
import henceforthApi from "@/utils/henceforthApis";
import dayjs from "dayjs";

interface Page {
  id: number;
  title: string;
  updatedAt: string;
}

const PageManagement = () => {
  const [contentListing, setContentListing] = React.useState({
    data: [],
  });

  const getContentPages = async () => {
    try {
      const apiRes = await henceforthApi.SuperAdmin.contentPageListing();
      setContentListing({ data: apiRes?.data });
    } catch (error) {}
  };
  useEffect(() => {
    getContentPages();
  }, []);
  const columns = [
    {
      header: "Sr. no.",
      cell: ({ row }) => {
        return <span>{row.index + 1}</span>;
      },
    },
    {
      header: "Title",
      accessorKey: "page_type",
      cell: ({ row }) => {
        return (
          <span>
            {row.original?.page_type
              ?.split("_")
              ?.map(
                (word) =>
                  word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase()
              )
              .join(" ")}
          </span>
        );
      },
    },
    {
      header: "Updated at",
      accessorKey: "created_at",
      cell: ({ row }) => (
        <span>{dayjs(row.original.created_at).format("DD MMM YYYY")}</span>
      ),
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link href={`/settings/page-management/view/${row?.original?._id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/settings/page-management/edit/${row?.original?._id}`}>
            <Button variant="outline" size="sm">
              <PenSquare className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <PageContainer>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Page Management
          </CardTitle>
          <CardDescription>
            Manage and update important pages like Privacy Policy and Terms &
            Conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={contentListing?.data}
            totalItems={10}
          />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PageManagement />
    </DashboardLayout>
  );
}
