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
  Bot,
  Building2,
  Camera,
  Check,
  ChevronsUpDown,
  LibraryBig,
  Loader2,
  PhoneIncoming,
  Router,
  Settings,
  ShoppingBag,
  TestTube2,
  TicketCheck,
  User,
  UserPen,
  Users2,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import countryCode from "@/utils/countryCode.json";

import "flag-icons/css/flag-icons.min.css";
import { useRouter } from "next/navigation";
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  phoneNumber: z
    .string()
    .min(5, { message: "Phone number must be at least 5 characters." }),
  countryCode: z.string().optional(),
  module_permission: z
    .array(z.string())
    .min(1, { message: "Select at least one module permission." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const CreateStaff = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { Toast } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const TabsList = [
    { value: "workspaces", label: "Workspaces", icon: Building2 },
    { value: "vendors", label: "Vendors", icon: Users2 },
    { value: "accounting", label: "Accounting", icon: UserPen },
    { value: "aiagents", label: "AI Agents", icon: Bot },
    {
      value: "ticket-management",
      label: "Ticket Management",
      icon: TicketCheck,
    },
    {
      value: "knowledge-base",
      label: "Knowledge Base",
      icon: LibraryBig,
    },
    {
      value: "white-label-leads",
      label: "White Label Leads",
      icon: ShoppingBag,
    },
    { value: "settings", label: "Settings", icon: Settings },
    { value: "call-testing", label: "Call Testing", icon: PhoneIncoming },
    { value: "website-testing", label: "Website Testing", icon: TestTube2 },
  ];

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
      name: "",
      email: "",
      module_permission: [],
      phoneNumber: "",
      countryCode: "",
      password: "",
    },
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      console.log(data);

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone_no: data.phoneNumber,
        country_code: data.countryCode,
        module_permission: data.module_permission,
      };
      payload["profile_pic"] = imageState?.uploadedFileName;

      await henceforthApi.SuperAdmin.createStaff(payload);

      Toast.success("Staff added successfully.");
      router.push("/settings/staff/page/1");
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
                          <User className="h-10 w-10" />
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
                  <Label>Name</Label>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem className="flex-shrink-0">
                          <FormControl>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn("w-[150px] justify-between")}
                                >
                                  {field.value ? (
                                    <>
                                      <span
                                        className={
                                          countryCode.find(
                                            (country: any) =>
                                              country?.dial_code === field.value
                                          )?.flagClass + " me-2"
                                        }
                                      ></span>
                                      {
                                        countryCode.find(
                                          (country: any) =>
                                            country?.dial_code === field.value
                                        )?.dial_code
                                      }
                                    </>
                                  ) : (
                                    "Select.."
                                  )}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="start"
                                className="w-full p-0"
                              >
                                <Command>
                                  <CommandInput placeholder="Search country code..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      No country code found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      <ScrollArea className="h-56">
                                        {countryCode.map((country: any) => (
                                          <CommandItem
                                            key={country.dial_code}
                                            onSelect={() => {
                                              form.setValue(
                                                "countryCode",
                                                country.dial_code
                                              );
                                              setOpen(false);
                                            }}
                                          >
                                            <span
                                              className={
                                                country.flagClass + " me-1"
                                              }
                                            ></span>
                                            <span className="me-1">
                                              {"(" + country?.dial_code + ")"}
                                            </span>
                                            {country.name}
                                            <Check
                                              className={cn(
                                                "ml-auto h-4 w-4",
                                                field.value ===
                                                  country.dial_code
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                      </ScrollArea>
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-1">
                    <FormMessage>
                      {form.formState.errors.countryCode?.message}
                    </FormMessage>
                    <FormMessage>
                      {form.formState.errors.phoneNumber?.message}
                    </FormMessage>
                  </div>
                </div>

                <div>
                  <Label>Password</Label>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <Label>Module Permissions</Label>
                  <FormField
                    control={form.control}
                    name="module_permission"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelect
                            options={TabsList}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select Modules"
                            variant="inverted"
                            animation={2}
                            maxCount={8}
                          />
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
