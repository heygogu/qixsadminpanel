"use client"
import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    UserPlus,
    Pencil,
    Trash2,
    Eye,
    Mail,
    Phone,
    Building,
    Shield,
    Calendar
} from "lucide-react";
import { DataTable } from '@/components/common/data-table';
import DashboardLayout from '@/components/layouts/dashboard-layout';
import PageContainer from '@/components/layouts/page-container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { access } from 'fs';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Mock data
const mockStaffData = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        image: "https://github.com/shadcn.png",
        status: "Active",
        phone: "+1 234 567 890",
        department: "Engineering",
        joinDate: "2024-01-15",
        accessModules: ["Dashboard", "Users", "Reports", "Settings"],
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        image: "https://github.com/shadcn.png",
        status: "Pending",
        phone: "+1 234 567 891",
        department: "Marketing",
        joinDate: "2024-01-20",
        accessModules: ["Dashboard", "Content", "Analytics"],
    },
];




// Staff Listing Component
const StaffListing = () => {
    const [selectedStaff, setSelectedStaff] = React.useState<any>(null);
    const columns = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: info => (
                <div className="flex items-center gap-2">
                    <Avatar className='w-8 h-8 border-2 border-white shadow-lg'>
                        <AvatarImage className='object-cover' src={info.row.original.image ?? "https://github.com/shadcn.png"} alt={info.getValue()} />
                        <AvatarFallback>{info.getValue().charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{info.getValue()}</span>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => (
                <Badge
                    variant={info.getValue() === "Active" ? "default" : "destructive"}
                    className={`mt-1 ${info.getValue() === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {info.getValue()}
                </Badge>
            ),
        },
        {
            accessorKey: 'accessModules',
            header: 'Access Modules',
            cell: info => (


                <div className="flex flex-wrap gap-1 w-[150px]">
                    {info.getValue().slice(0, 3).map((module: string) => (
                        <Badge key={module} variant="secondary" className="bg-gray-100 text-gray-800">
                            {module}
                        </Badge>
                    ))}
                    {info.getValue().length > 3 && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge variant="secondary" className="bg-gray-100 text-gray-800 cursor-pointer">
                                    +{info.getValue().length - 3}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="flex flex-col gap-1">
                                    {info.getValue().map((module: string) => (
                                        <Badge key={module} variant="secondary" className="bg-gray-100 text-gray-800">
                                            {module}
                                        </Badge>
                                    ))}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            )
        },
        {
            accessorKey: 'joinDate',
            header: 'Join Date',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button onClick={() => setSelectedStaff(row.original)} variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];
    return (
        <PageContainer>

            <div className=" grid grid-cols-1 col-span-1 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Staff Management</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Add Staff
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Staff Member</DialogTitle>
                            </DialogHeader>
                            {/* Dialog content will be added later */}
                            <div className="p-4">Form fields will go here</div>
                        </DialogContent>
                    </Dialog>
                </div>

                <DataTable
                    columns={columns}
                    data={mockStaffData}
                    totalItems={10}
                />

                {selectedStaff && (
                    <div className="mt-8 p-6 border rounded-lg space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <Avatar className='w-24 h-24 border-4 border-white shadow-lg'>
                                    <AvatarImage className='object-cover' src={selectedStaff?.image ?? "https://github.com/shadcn.png"} alt={selectedStaff.name} />
                                    <AvatarFallback>{selectedStaff.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedStaff.name}</h2>
                                    <Badge
                                        variant={selectedStaff.status === "Active" ? "default" : "destructive"}
                                        className={`mt-1 ${selectedStaff.status === "Active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {selectedStaff.status}
                                    </Badge>
                                </div>
                            </div>
                            <Button variant="outline" onClick={() => setSelectedStaff(null)}>
                                Close Details
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">Email:</span>
                                    <span>{selectedStaff.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">Phone:</span>
                                    <span>{selectedStaff.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">Department:</span>
                                    <span>{selectedStaff.department}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">Join Date:</span>
                                    <span>{selectedStaff.joinDate}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Shield className="w-4 h-4 text-gray-500 mt-1" />
                                    <div>
                                        <span className="text-gray-600">Access Modules:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedStaff.accessModules.map((module) => (
                                                <Badge
                                                    key={module}
                                                    variant="secondary"
                                                    className="bg-gray-100 text-gray-800"
                                                >
                                                    {module}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

// export default StaffListing;
export default function DashboardPage() {
    return (

        <DashboardLayout><StaffListing /></DashboardLayout>
    )


}