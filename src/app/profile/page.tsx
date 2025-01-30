"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Pencil, KeyRound, Loader, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import { useGlobalContext } from "../providers/Provider";
import henceforthApi from "../../utils/henceforthApis";

const AdminProfile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { userInfo } = useGlobalContext();
  const [logo, setLogo] = useState<string>(userInfo?.profile_pic ?? "");
  const [imageLoading, setImageLoading] = useState(false);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageLoading(true);
    const file = e.target.files?.[0];
    if (file) {
      // Handle the file upload logic here
      console.log("Selected file:", file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageLoading(false);
    }
  };
  return (
    <PageContainer>
      <h1 className=" text-2xl font-semibold pb-4">Profile Settings</h1>
      <div className="">
        {/* Banner */}
        <div className="h-64 bg-gradient-to-r rounded-lg from-violet-700 to-primary"></div>

        {/* Main Content */}
        <div className="container mx-auto px-4">
          <Card className="-mt-32 mb-8 max-w-3xl mx-auto shadow-xl">
            <CardContent className="p-6">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage
                      className="object-cover"
                      src={henceforthApi?.FILES?.imageOriginal(logo, "")}
                    />
                    <AvatarFallback className="bg-gray-200">SA</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-0 h-8 w-8 rounded-full"
                    onClick={() =>
                      document.getElementById("upload-image-input")?.click()
                    }
                  >
                    {imageLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                  <input
                    type="file"
                    id="upload-image-input"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>

                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold capitalize text-gray-900">
                    {userInfo?.name}
                  </h2>
                  <p className="text-gray-500">{userInfo?.email}</p>
                  <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                    <Dialog
                      open={showEditProfile}
                      onOpenChange={setShowEditProfile}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue="Admin User" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              defaultValue="admin@company.com"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setShowEditProfile(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={() => setShowEditProfile(false)}>
                            Save changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={showChangePassword}
                      onOpenChange={setShowChangePassword}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <KeyRound className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                          <DialogDescription>
                            Update your password here
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="current">Current Password</Label>
                            <Input id="current" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new">New Password</Label>
                            <Input id="new" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm">
                              Confirm New Password
                            </Label>
                            <Input id="confirm" type="password" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setShowChangePassword(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={() => setShowChangePassword(false)}>
                            Update password
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Profile Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p className="text-gray-900 capitalize">{userInfo?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{userInfo?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-gray-900">
                      {userInfo?.role ?? "Super Admin"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      Last Login
                    </p>
                    <p className="text-gray-900">Today at 2:34 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

// export default AdminProfile;
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <AdminProfile />
    </DashboardLayout>
  );
}
