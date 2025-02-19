"use client";
import React, { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
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
  Building2,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  ImageIcon,
  User,
} from "lucide-react";
import PageContainer from "@/components/layouts/page-container";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  FaCashRegister,
  FaMoneyBill,
  FaMoneyBill1,
  FaMoneyBill1Wave,
  FaMoneyBillTrendUp,
  FaMoneyBillWave,
  FaRupeeSign,
} from "react-icons/fa6";
import { count } from "console";
import henceforthApi from "@/utils/henceforthApis";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import PaginationCompo from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

// Mock data for accounting entries

// Summary metrics for the dashboard

// Column definitions
// const accountingColumns = [
//   {
//     accessorKey: "orderNumber",
//     header: "Order Number",
//     cell: ({ row }) => (
//       <span className="font-medium">{row.original.orderNumber}</span>
//     ),
//   },
//   {
//     accessorKey: "workspaceName",
//     header: "Workspace",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-2">
//         <Avatar className="h-8 w-8">
//           <AvatarImage
//             src={row.original.workspaceImage}
//             alt={row.original.workspaceName}
//           />
//           <AvatarFallback>
//             <ImageIcon className="h-4 w-4" />
//           </AvatarFallback>
//         </Avatar>
//         <span>{row.original.workspaceName}</span>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "date",
//     header: "Date",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-2">
//         <Calendar className="h-4 w-4 text-gray-500" />
//         {new Date(row.original.date).toLocaleDateString()}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "amount",
//     header: "Amount",
//     cell: ({ row }) => (
//       <div className="font-medium">₹{row.original.amount.toFixed(2)}</div>
//     ),
//   },
//   {
//     accessorKey: "expense",
//     header: "Expense",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-1 text-red-500">
//         <ArrowDownRight className="h-4 w-4" />₹{row.original.expense.toFixed(2)}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "earning",
//     header: "Earning",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-1 text-green-500">
//         <ArrowUpRight className="h-4 w-4" />₹{row.original.earning.toFixed(2)}
//       </div>
//     ),
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row }) => (
//       <Button variant="ghost" size="icon">
//         <Eye className="h-4 w-4" />
//       </Button>
//     ),
//   },
// ];

const AccountingModule = () => {
  const [accountsListing, setAccountsListing] = React.useState({
    data: [],
    count: 0,
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const getAccountsListing = async () => {
    try {
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
      const apiResponse = await henceforthApi.SuperAdmin.getAccountingData();

      setAccountsListing({
        data: apiResponse?.data?.data,
        count: apiResponse?.data?.count,
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    const query = new URLSearchParams(searchParams?.toString());

    router.replace(`/accounting/page/${page}?${query.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    getAccountsListing();
  }, [searchParams]);
  const [searchTerm, setSearchTerm] = React.useState(
    () => searchParams?.get("search") || ""
  );
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const accountingColumns = [
    {
      accessorKey: "index",
      header: "Sr. no",
      cell: ({ row }) => {
        let currentPage = Number(params?.pagination) || 1;
        let itemsPerPage = Number(searchParams.get("limit")) || 10;
        return (
          <span className="font-medium">
            {row.index + 1 + (currentPage - 1) * itemsPerPage}
          </span>
        );
      },
    },
    {
      accessorKey: "subscription_id",
      header: "Subscription ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.original?.subscription_id}</span>
      ),
    },
    {
      accessorKey: "workspace",
      header: "Workspace",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 border-2 border-white shadow-md">
            <AvatarImage
              src={henceforthApi?.FILES?.imageOriginal(
                row.original?.workspace?.image
              )}
              alt={row.original?.workspace?.name}
            />
            <AvatarFallback>
              <Building2 className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span>{row.original?.workspace?.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 border-2 border-white shadow-md">
            <AvatarImage
              className=" object-cover "
              src={henceforthApi?.FILES?.imageOriginal(
                row.original?.vendor?.profile_pic
              )}
              alt={row.original?.vendor?.name}
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span>{row.original?.vendor?.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "plan_name",
      header: "Plan",
      cell: ({ row }) => (
        <Badge variant={"secondary"} className="font-medium">
          {row.original?.plan_name}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium">₹{row.original?.amount?.toFixed(2)}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          {dayjs(row.original?.created_at).format("DD MMM YYYY")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={`px-2 py-1 rounded-lg shadow-md ${
            row.original?.status === "authenticated"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.original?.status === "authenticated" ? "Success" : "Pending"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];
  const skeletonColumns = accountingColumns.map((column: any) => ({
    ...column,
    cell: () => <Skeleton className="h-5 p-3 bg-gray-200 animate-pulse" />,
  }));
  const handleSearch = (value: string) => {
    const query = new URLSearchParams(searchParams?.toString());
    if (value) {
      query.set("search", value);
    } else {
      query.delete("search");
    }
    router.replace(`/accounting/page/1?${query.toString()}`, { scroll: false });
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

  return (
    <PageContainer>
      <div className="grid grid-cols-1 col-span-1 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-bold mt-2">{"N/A"}</h3>
                </div>
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                  <FaMoneyBill1Wave className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Earnings
                  </p>
                  <h3 className="text-2xl font-bold mt-2">{"N/A"}</h3>
                </div>
                <div className="p-2 bg-green-500 rounded-lg text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Expenses
                  </p>
                  <h3 className="text-2xl font-bold mt-2">{"N/A"}</h3>
                </div>
                <div className="p-2 bg-red-500 rounded-lg text-white">
                  <TrendingDown className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Growth Rate
                  </p>
                  <h3 className="text-2xl font-bold mt-2">{"N/A"}</h3>
                </div>
                <div className="p-2 bg-purple-500 rounded-lg text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                <span>Accounting Overview</span>
              </div>
            </CardTitle>
            <CardDescription>
              Track all subscription payments, expenses, and earnings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-3 h-4 w-4  text-gray-500" />
                <Input
                  placeholder="Search by vendor name..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
              {/* <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div> */}
            </div>

            {/* Data Table */}
            {isLoading ? (
              <DataTable
                columns={skeletonColumns}
                data={Array.from({ length: 10 })}
                totalItems={10}
              />
            ) : (
              <DataTable
                columns={accountingColumns}
                data={accountsListing?.data}
                totalItems={10}
              />
            )}
            {accountsListing?.data?.length ? (
              <div className="flex justify-center mt-6">
                <PaginationCompo
                  currentPage={Number(params?.pagination) || 1}
                  itemsPerPage={Number(searchParams.get("limit")) || 10}
                  totalDataCount={accountsListing?.count}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : (
              ""
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

// export default AccountingModule;
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <AccountingModule />
    </DashboardLayout>
  );
}
