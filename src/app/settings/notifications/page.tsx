"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MultipleSelector from "@/components/common/AsyncMultiSelect";
import { SendIcon } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import PageContainer from "@/components/layouts/page-container";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Validation schema
const notificationSchema = z.object({
  userType: z.enum(["vendors", "selectedVendors"]),
  notificationType: z.enum(["email", "sms", "web"]),
  selectedUsers: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

// Mock data for vendors and members
const MOCK_VENDORS = [
  { label: "Vendor 1", value: "vendor1" },
  { label: "Vendor 2", value: "vendor2" },
  { label: "Vendor 3", value: "vendor3" },
];

const NotificationSettings = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      userType: "vendors",
      notificationType: "email",
      selectedUsers: [],
      title: "",
      description: "",
    },
  });

  const userType = form.watch("userType");

  type Option = { label: string; value: string };

  const mockSearch = async (value: string): Promise<Option[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = MOCK_VENDORS.filter((option) =>
          option.label.toLowerCase().includes(value.toLowerCase())
        );
        resolve(filtered);
      }, 500);
    });
  };

  const onSubmit = async (data: z.infer<typeof notificationSchema>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", data);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 col-span-1">
        <div
          className={cn(
            "animate-in fade-in-50 duration-500 col-span-12",
            "slide-in-from-bottom-5"
          )}
        >
          <Card className="">
            <CardHeader>
              <div className="flex items-center gap-2">
                <SendIcon className="h-6 w-6" />
                <CardTitle>Send Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure and send notifications to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Users</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid lg:grid-cols-8 grid-cols-2 "
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="vendors" id="vendors" />
                              <label htmlFor="vendors">All Vendors</label>
                            </div>

                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="selectedVendors"
                                id="selectedVendors"
                              />
                              <label htmlFor="selectedVendors">
                                Selected Vendors
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {userType === "selectedVendors" && (
                    <FormField
                      control={form.control}
                      name="selectedUsers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Vendors</FormLabel>
                          <FormControl>
                            <MultipleSelector
                              value={field.value}
                              onChange={field.onChange}
                              defaultOptions={MOCK_VENDORS}
                              onSearch={async (value) => {
                                // setIsTriggered(true);
                                const res = await mockSearch(value);
                                // setIsTriggered(false);
                                return res;
                              }}
                              placeholder={`Search ${
                                userType === "selectedVendors"
                                  ? "vendors"
                                  : "members"
                              }...`}
                              loadingIndicator={
                                <p className="py-2 text-center text-muted-foreground">
                                  Loading...
                                </p>
                              }
                              emptyIndicator={
                                <p className="py-2 text-center text-muted-foreground">
                                  No results found
                                </p>
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="notificationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="email" id="email" />
                              <label htmlFor="email">Email</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sms" id="sms" />
                              <label htmlFor="sms">SMS</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="web" id="web" />
                              <label htmlFor="web">Web</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <Label>Title</Label>

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          {/* <FormLabel>Title</FormLabel> */}
                          <FormControl>
                            <Input
                              placeholder="Notification title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Write description here..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Notification"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default function NotificationPage() {
  return (
    <DashboardLayout>
      <NotificationSettings />
    </DashboardLayout>
  );
}
