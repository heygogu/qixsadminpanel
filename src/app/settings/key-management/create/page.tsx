// {
//     "name": "Admin Workspace",
//     "description": "Admin workspace used for website, call & chats",
//     "image": null,
//     "secret_key": "secret_xxxxxxxxxxxxxxxx"
//   }

"use client";
import { useGlobalContext } from "@/app/providers/Provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import henceforthApi from "@/utils/henceforthApis";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Camera,
  Loader2,
  Plus,
  RecycleIcon,
  RefreshCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import { cn } from "@/lib/utils";
import { MultiSelect } from "@/components/common/MultiSelect";
import { Label } from "@/components/ui/label";

import "flag-icons/css/flag-icons.min.css";
import { useRouter } from "next/navigation";
const profileFormSchema = z.object({
  title: z.string().min(2, { message: "title must be at least 2 characters." }),
  description: z
    .string()
    .min(2, { message: "description must be at least 2 characters." }),
  secret_key: z
    .string()
    .min(2, { message: "secret_key must be at least 2 characters." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const CreateStaff = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { Toast } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [imageState, setImageState] = useState<{
    preview?: string;
    uploading: boolean;
    uploadedFileName?: string;
  }>({
    uploading: false,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      title: "",
      description: "",
      secret_key: "",
    },
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      console.log(data);
      // "name": "Admin Workspace",
      //   "description": "Admin workspace used for website, call & chats",
      //   "image": null,
      //   "secret_key": "secret_xxxxxxxxxxxxxxxx"
      const payload = {
        name: data.title,
        description: data.description,
        secret_key: data.secret_key,
      };
      payload["image"] = imageState?.uploadedFileName;

      await henceforthApi.SuperAdmin.createWorkspace(payload);

      Toast.success("Workspace and key added successfully.");
      router.push("/settings/key-management/page/1");
    } catch (error: any) {
      Toast.error(error || "An unexpected error occurred");
    }
  };

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

  const avatarSrc = imageState?.uploadedFileName
    ? henceforthApi?.FILES.imageOriginal(imageState?.uploadedFileName, "")
    : "";

  return (
    <PageContainer>
      <div
        className={cn(
          "animate-in fade-in-50 grid grid-cols-2 duration-500",
          "slide-in-from-bottom-5"
        )}
      >
        <Card className="col-span-1 py-3">
          <CardHeader className="mb-5">
            <CardTitle>Create Staff</CardTitle>
            <CardDescription>
              Fill in the form below to create a new staff member.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-gray-200">
                      {avatarSrc ? (
                        <AvatarImage
                          src={avatarSrc}
                          alt="Profile"
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="text-2xl bg-gray-100">
                          <Building2 className="h-10 w-10" />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="absolute bottom-0 right-0 flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageState?.uploading}
                      >
                        {imageState?.uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera color="white" className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />

                <div>
                  <Label>Title</Label>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter workspace title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter workspace description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label>Secret Key</Label>
                  <FormField
                    control={form.control}
                    name="secret_key"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...field}
                              placeholder="Your secret key"
                              readOnly
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="whitespace-nowrap"
                              onClick={async () => {
                                try {
                                  const response =
                                    await henceforthApi.SuperAdmin.generateSecretKey();
                                  field.onChange(response.data);
                                } catch (error) {
                                  Toast.error("Failed to generate secret key");
                                }
                              }}
                            >
                              {field.value ? <RefreshCcw /> : <Plus />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-primary mt-4 w-full text-white"
                  disabled={
                    form.formState.isSubmitting || imageState?.uploading
                  }
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default function CreateStafff() {
  return (
    <DashboardLayout>
      <CreateStaff />
    </DashboardLayout>
  );
}
