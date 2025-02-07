"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Camera,
  Pencil,
  KeyRound,
  Loader2,
  EyeOff,
  Eye,
  User,
} from "lucide-react";
import { useGlobalContext } from "../providers/Provider";
import henceforthApi from "../../utils/henceforthApis";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";

// Profile form schema

const PasswordInput = ({
  field,
  showPassword,
  setShowPassword,
  placeholder,
}: {
  field: any;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  placeholder: string;
}) => (
  <div className="relative">
    <Input
      {...field}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
    />
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <Eye className="h-4 w-4 text-gray-500" />
      ) : (
        <EyeOff className="h-4 w-4 text-gray-500" />
      )}
    </Button>
  </div>
);
const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces.",
    }),
});

// Password form schema
const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    newPassword: z
      .string()
      .min(5, { message: "Password must be at least 8 characters." }),
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    //   message:
    //     "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    // }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const AdminProfile = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { userInfo, Toast, setUserInfo } = useGlobalContext();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [imageState, setImageState] = useState<{
    preview?: string;
    uploading: boolean;
    uploadedFileName?: string;
  }>({
    uploading: false,
  });

  useEffect(() => {
    setImageState({
      preview: henceforthApi?.FILES.imageOriginal(userInfo?.profile_pic, ""),
      uploading: false,
      uploadedFileName: userInfo?.profile_pic,
    });
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userInfo?.name || "",
    },
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        Toast.error("Invalid file type. Please upload JPEG, PNG, or WebP.");
        return;
      }

      if (file.size > maxSize) {
        Toast.error("File is too large. Maximum size is 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageState((prev) => ({
          ...prev,
          preview: reader.result as string,
          uploading: false,
        }));
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);

      try {
        setImageState((prev) => ({ ...prev, uploading: true }));
        const apiRes = await henceforthApi.SuperAdmin.imageUpload(formData);

        const info = {
          profile_pic: apiRes?.file_name,
        };
        await henceforthApi.SuperAdmin.updateProfile(info);
        setUserInfo((prev) => ({ ...prev, profile_pic: apiRes?.file_name }));
        Toast.success("Image uploaded successfully");
        setImageState({
          preview: reader.result as string,
          uploading: false,
          uploadedFileName: apiRes?.file_name,
        });
      } catch (error) {
        Toast.error("Failed to upload image");
        setImageState((prev) => ({ ...prev, uploading: false }));
      }
    },
    [Toast]
  );

  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      await henceforthApi.SuperAdmin.updateProfile(data);
      setUserInfo((prev) => ({ ...prev, name: data.name }));
      Toast.success("Profile updated successfully");
      setShowEditProfile(false);
    } catch (error) {
      Toast.error("Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    try {
      // Add your password update API call here
      console.log(data, "SFBDJHWEGIF");

      const payload = {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      await henceforthApi.SuperAdmin.updatePassword(payload);
      Toast.success("Password updated successfully");
      setShowChangePassword(false);
      passwordForm.reset();
    } catch (error) {
      Toast.error("Failed to update password");
    }
  };
  const avatarSrc = imageState?.preview;
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold pb-4">Profile Settings</h1>
      <div>
        <div className="h-64 bg-gradient-to-r rounded-lg from-violet-700 to-primary"></div>

        <div className="container mx-auto px-4">
          <Card className="-mt-32 mb-8 max-w-3xl mx-auto shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage className="object-cover" src={avatarSrc} />
                    <AvatarFallback className="bg-gray-200">
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 bg-primary text-white -right-0 h-8 w-8 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageState?.uploading}
                  >
                    {imageState?.uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 " />
                    )}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
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
                        <Form {...profileForm}>
                          <form
                            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                            className="space-y-4"
                          >
                            <FormField
                              control={profileForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-end gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowEditProfile(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={profileForm.formState.isSubmitting}
                              >
                                {profileForm.formState.isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                  </>
                                ) : (
                                  "Save changes"
                                )}
                              </Button>
                            </div>
                          </form>
                        </Form>
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
                        <Form {...passwordForm}>
                          <form
                            onSubmit={passwordForm.handleSubmit(
                              onPasswordSubmit
                            )}
                            className="space-y-4"
                          >
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <PasswordInput
                                      field={field}
                                      showPassword={showCurrentPassword}
                                      setShowPassword={setShowCurrentPassword}
                                      placeholder="Enter current password"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <PasswordInput
                                      field={field}
                                      showPassword={showNewPassword}
                                      setShowPassword={setShowNewPassword}
                                      placeholder="Enter new password"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm New Password</FormLabel>
                                  <FormControl>
                                    <PasswordInput
                                      field={field}
                                      showPassword={showConfirmPassword}
                                      setShowPassword={setShowConfirmPassword}
                                      placeholder="Confirm new password"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-end gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setShowChangePassword(false);
                                  setShowCurrentPassword(false);
                                  setShowNewPassword(false);
                                  setShowConfirmPassword(false);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={passwordForm.formState.isSubmitting}
                              >
                                {passwordForm.formState.isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  "Update password"
                                )}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

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

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <AdminProfile />
    </DashboardLayout>
  );
}
