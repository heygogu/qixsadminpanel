// app/page-management/page.tsx
"use client";
import React from "react";
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

interface Page {
  id: number;
  title: string;
  updatedAt: string;
}

const pages: Page[] = [
  { id: 1, title: "Privacy Policy", updatedAt: "21 Jun 2024" },
  { id: 2, title: "Terms & Conditions", updatedAt: "21 Jun 2024" },
  { id: 3, title: "About Us", updatedAt: "21 Jun 2024" },
];

const columns = [
  {
    header: "Sr. no.",
    accessorKey: "id",
  },
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Updated at",
    accessorKey: "updatedAt",
  },
  {
    header: "Action",
    accessorKey: "id",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/settings/page-management/view/${row
            .getValue("title")
            .toLowerCase()
            .replace(/ /g, "-")}`}
        >
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link
          href={`/settings/page-management/edit/${row
            .getValue("title")
            .toLowerCase()
            .replace(/ /g, "-")}`}
        >
          <Button variant="outline" size="sm">
            <PenSquare className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

const PageManagement = () => {
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
          <DataTable columns={columns} data={pages} totalItems={pages.length} />
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
